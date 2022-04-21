import { EVENTS } from './custom_event_handler.js';
import { PlayfieldMode } from './playfield.js';


export const DrawMode = {
    SCRIBBLE: 'SCRIBBLE',
    LINE: 'LINE',
    FILLED_RECT: 'FILLED_RECT',
    RECT: 'RECT',
    FILLED_ELLIPSE: 'FILLED_ELLIPSE',
    ELLIPSE: 'ELLIPSE',
};

const drawModeOperations = new Map();

drawModeOperations.set(DrawMode.SCRIBBLE, {
    onStart: (playfield, x, y, value) => {
        playfield.setPixel(x, y, value);
    },
    onMove: (initialPlayfield, initalX, initalY, playfield, x, y, value) => {
        playfield.setPixel(x, y, value);
    },
});

drawModeOperations.set(DrawMode.FILLED_RECT, {
    onStart: (playfield, x, y, value) => {
        playfield.swapPixel(x, y, value);
    },
    onMove: (initialPlayfield, initialX, initialY, playfield, currentX, currentY, value) => {
        playfield.data = initialPlayfield.data;
        const [fromY, toY] = currentY <= initialY ? [currentY, initialY] : [initialY, currentY];
        const [fromX, toX] = currentX <= initialX ? [currentX, initialX] : [initialX, currentX];
        for (let y = fromY; y <= toY; ++y) {
            for (let x = fromX; x <= toX; ++x) {
                playfield.setPixel(x, y, value);
            }
        }
    },
});

drawModeOperations.set(DrawMode.RECT, {
    onStart: (playfield, x, y, value) => {
        playfield.swapPixel(x, y, value);
    },
    onMove: (initialPlayfield, initialX, initialY, playfield, currentX, currentY, value) => {
        playfield.data = initialPlayfield.data;
        const [fromY, toY] = currentY <= initialY ? [currentY, initialY] : [initialY, currentY];
        const [fromX, toX] = currentX <= initialX ? [currentX, initialX] : [initialX, currentX];

        for (let x = fromX; x <= toX; ++x) {
            playfield.setPixel(x, fromY, value);
        }
        for (let y = fromY; y <= toY; ++y) {
            playfield.setPixel(fromX, y, value);
            playfield.setPixel(toX, y, value);
        }
        for (let x = fromX; x <= toX; ++x) {
            playfield.setPixel(x, toY, value);
        }
    },
});

drawModeOperations.set(DrawMode.LINE, {
    onStart: (playfield, x, y, value) => {
        playfield.swapPixel(x, y, value);
    },
    onMove: (initialPlayfield, initialX, initialY, playfield, currentX, currentY, value) => {
        playfield.data = initialPlayfield.data;
        // Bresenham as described by wikipedia

        const dx = Math.abs(initialX - currentX);
        const dy = -Math.abs(initialY - currentY);
        const sx = initialX < currentX ? 1 : -1;
        const sy = initialY < currentY ? 1 : -1;
        let err = dx + dy;
        let x = initialX;
        let y = initialY;
        for (;;) {
            playfield.setPixel(x, y, value);
            if (x === currentX && y === currentY) break;
            const e2 = err * 2;
            if (e2 >= dy) {
                err += dy;
                x += sx;
            }
            if (e2 <= dx) {
                err += dx;
                y += sy;
            }
        }
    },
});

drawModeOperations.set(DrawMode.ELLIPSE, {
    onStart: (playfield, x, y, value) => {
        playfield.swapPixel(x, y, value);
    },
    onMove: (initialPlayfield, initialX, initialY, playfield, currentX, currentY, value) => {
        playfield.data = initialPlayfield.data;
        // From http://members.chello.at/~easyfilter/Bresenham.pdf

        const a = Math.abs(currentX - initialX);
        const b = Math.abs(currentY - initialY);

        let x = -a;
        let y = 0;
        let e2 = b * b;
        let err = x * (2 * e2 + x) + e2;

        do {
            playfield.setPixel(initialX - x, initialY + y, value);
            playfield.setPixel(initialX + x, initialY + y, value);
            playfield.setPixel(initialX + x, initialY - y, value);
            playfield.setPixel(initialX - x, initialY - y, value);
            e2 = 2 * err;
            if (e2 >= (x * 2 + 1) * b * b) {
                ++x;
                err += (x * 2 + 1) * b * b;
            }
            if (e2 <= (y * 2 + 1) * a * a) {
                ++y;
                err += (y * 2 + 1) * a * a;
            }
        } while (x <= 0);

        while (y++ < b) {
            playfield.setPixel(initialX, initialY + y, value);
            playfield.setPixel(initialX, initialY - y, value);
        }
    },
});

drawModeOperations.set(DrawMode.FILLED_ELLIPSE, {
    onStart: (playfield, x, y, value) => {
        playfield.swapPixel(x, y, value);
    },
    onMove: (initialPlayfield, initialX, initialY, playfield, currentX, currentY, value) => {
        playfield.data = initialPlayfield.data;

        const a = Math.abs(currentX - initialX);
        const b = Math.abs(currentY - initialY);

        let x = -a;
        let y = 0;
        let e2 = b * b;
        let err = x * (2 * e2 + x) + e2;

        do {
            playfield.setPixel(initialX - x, initialY + y, value);
            playfield.setPixel(initialX + x, initialY + y, value);
            playfield.setPixel(initialX + x, initialY - y, value);
            playfield.setPixel(initialX - x, initialY - y, value);
            e2 = 2 * err;
            if (e2 >= (x * 2 + 1) * b * b) {
                ++x;
                err += (x * 2 + 1) * b * b;
            }
            if (e2 <= (y * 2 + 1) * a * a) {
                for (let fx = -x; fx >= 0; --fx) {
                    playfield.setPixel(initialX - fx, initialY + y, value);
                    playfield.setPixel(initialX + fx, initialY + y, value);
                    playfield.setPixel(initialX + fx, initialY - y, value);
                    playfield.setPixel(initialX - fx, initialY - y, value);
                }
                ++y;
                err += (y * 2 + 1) * a * a;
            }
        } while (x <= 0);

        while (y++ < b) {
            playfield.setPixel(initialX, initialY + y, value);
            playfield.setPixel(initialX, initialY - y, value);
        }
    },
});

const idsAndModes = [
    ['drawModeScribble', DrawMode.SCRIBBLE],
    ['drawModeLine', DrawMode.LINE],
    ['drawModeFilledRect', DrawMode.FILLED_RECT],
    ['drawModeRectangle', DrawMode.RECT],
    ['drawModeFilledEllipse', DrawMode.FILLED_ELLIPSE],
    ['drawModeEllipse', DrawMode.ELLIPSE],
];

export class Editor {
    #undos;
    #currentUndoLevel;
    #drawMode;
    #editorPlayfield;

    constructor(document, eventHandler, initialPlayfield) {
        this.document = document;
        this.eventHandler = eventHandler;
        this.canvas = document.getElementById('editor_playfield');
        this.#editorPlayfield = initialPlayfield.clone();
        this.setDrawMode(DrawMode.SCRIBBLE)
        this.#undos = new Map(); // <number, Playfield[]>
        this.#currentUndoLevel = 0;

        this.#pushUndo();

        this.canvasRowsPerVcsPixel = this.canvas.height / initialPlayfield.height;
        this.canvasColumnsPerVcsPixel = this.canvas.width / initialPlayfield.width;

        this.mouseDownHandler = (e) => this.mouseDown(e);
        this.mouseMoveHandler = (e) => this.mouseMove(e);
        this.mouseUpHandler = (e) => this.mouseUp(e);

        this.canvas.oncontextmenu = () => false;
        this.canvas.addEventListener('mousedown', this.mouseDownHandler);

        eventHandler.addEventListener(EVENTS.PLAYFIELD_STATE_CHANGED, (e) => {
            [...document.getElementsByClassName('playfieldMode')].forEach((e) => e.classList.remove('selected'));
            document.getElementById(e.detail.playfieldMode === PlayfieldMode.NORMAL ? 'playfieldNormalMode' : 'playfieldMirrorMode').classList.add('selected');

            document.getElementById('edit_mode_pf0').value = e.detail.registerModes[0];
            document.getElementById('edit_mode_pf1').value = e.detail.registerModes[1];
            document.getElementById('edit_mode_pf2').value = e.detail.registerModes[2];
        });
        this.#handlePlayfieldStateChanges();

        document.getElementById('playfieldNormalMode').addEventListener('click', () => this.setEditorMode(PlayfieldMode.NORMAL));
        document.getElementById('playfieldMirrorMode').addEventListener('click', () => this.setEditorMode(PlayfieldMode.REFLECTED));
        document.getElementById('playfieldUndo').addEventListener('click', () => this.undo());
        document.getElementById('playfieldRedo').addEventListener('click', () => this.redo());

        document.getElementById('edit_mode_pf0').addEventListener('change', (e) => this.setRegisterMode(0, e.target.value));
        document.getElementById('edit_mode_pf1').addEventListener('change', (e) => this.setRegisterMode(1, e.target.value));
        document.getElementById('edit_mode_pf2').addEventListener('change', (e) => this.setRegisterMode(2, e.target.value));

        idsAndModes.forEach(([id, mode]) => document.getElementById(id).addEventListener('click', () => this.setDrawMode(mode)));

        this.updateCanvasFromEditorPlayfield();
    }

    updateCanvasFromEditorPlayfield() {
        const data = this.#editorPlayfield.data;
        const context = this.canvas.getContext('2d');

        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.fillStyle = 'orange';

        for (let row = 0; row < this.#editorPlayfield.height; ++row) {
            for (let col = 0; col < this.#editorPlayfield.width; ++col) {
                if (data[row][col]) {
                    context.fillRect(
                        col * this.canvasColumnsPerVcsPixel,
                        row * this.canvasRowsPerVcsPixel,
                        this.canvasColumnsPerVcsPixel,
                        this.canvasRowsPerVcsPixel
                    );
                }
            }
        }
    }

    setDrawMode(newMode) {
        this.#drawMode = newMode;

        [...document.getElementsByClassName('drawMode')].forEach((e) => e.classList.remove('selected'));
        const selectedDrawModeId = idsAndModes.find(([id, mode]) => mode === newMode)?.[0];
        document.getElementById(selectedDrawModeId)?.classList.add('selected');
    }

    #pushUndo() {
        const undosForCurrentPlayfield = this.#undos.get(this.#editorPlayfield.id)?.slice(0, this.#currentUndoLevel + 1) ?? [];
        undosForCurrentPlayfield.push(this.#editorPlayfield.clone());
        this.#currentUndoLevel = undosForCurrentPlayfield.length - 1;
        this.#undos.set(this.#editorPlayfield.id, undosForCurrentPlayfield);
    }

    #handlePlayfieldStateChanges() {
        const registerModes = this.#editorPlayfield.getRegisterModes();
        const playfieldMode = this.#editorPlayfield.mode;
        this.eventHandler.sendChangePlayfieldState(this.#editorPlayfield.id, registerModes, playfieldMode);
        this.eventHandler.sendChangePlayfieldData(this.#editorPlayfield.id, this.#editorPlayfield.data);
    }

    #getPlayfieldFromUndo() {
        return this.#undos.get(this.#editorPlayfield.id)[this.#currentUndoLevel];
    }

    #setPlayfieldFromUndo() {
        const oldPlayfield = this.#getPlayfieldFromUndo();
        this.#editorPlayfield.height = oldPlayfield.height;
        this.#editorPlayfield.mode = oldPlayfield.mode;
        this.#editorPlayfield.data = oldPlayfield.data;
        this.#editorPlayfield.setRegisterModes(oldPlayfield.getRegisterModes());

        this.eventHandler.sendChangePlayfieldData(this.#editorPlayfield.id, this.#editorPlayfield.data);

        this.#handlePlayfieldStateChanges();
        this.updateCanvasFromEditorPlayfield();
    }

    undo() {
        if (this.#currentUndoLevel > 0) {
            this.#currentUndoLevel--;
            this.#setPlayfieldFromUndo();
        }
    }

    redo() {
        if (this.#currentUndoLevel < this.#undos.get(this.#editorPlayfield.id)?.length - 1) {
            this.#currentUndoLevel++;
            this.#setPlayfieldFromUndo();
        }
    }

    getPlayfieldCoordinatesFromMousePosition(mouseX, mouseY) {
        const boundingBox = this.canvas.getBoundingClientRect();
        const canvasX = ((mouseX - boundingBox.left) * this.canvas.width) / boundingBox.width;
        const canvasY = ((mouseY - boundingBox.top) * this.canvas.height) / boundingBox.height;
        return {
            playFieldX: Math.floor(canvasX / this.canvasColumnsPerVcsPixel),
            playFieldY: Math.floor(canvasY / this.canvasRowsPerVcsPixel),
        };
    }

    setEditorMode(newMode) {
        if (newMode != this.#editorPlayfield.mode) {
            this.#editorPlayfield.mode = newMode;
            this.updateCanvasFromEditorPlayfield();
            this.#pushUndo();
            this.#handlePlayfieldStateChanges();
        }
    }

    setRegisterMode(register, newMode) {
        this.#editorPlayfield.setRegisterMode(register, newMode);
        this.updateCanvasFromEditorPlayfield();
        this.#pushUndo();
        this.#handlePlayfieldStateChanges();
    }

    #intialPlayfield;

    #startX;
    #startY;
    #lastX;
    #lastY;

    mouseDown(e) {
        e.preventDefault();

        this.#intialPlayfield = this.#getPlayfieldFromUndo().copy();
        const { playFieldX, playFieldY } = this.getPlayfieldCoordinatesFromMousePosition(e.pageX, e.pageY);
        this.#lastX = playFieldX;
        this.#startX = playFieldX;
        this.#lastY = playFieldY;
        this.#startY = playFieldY;
        const value = e.buttons & 2 ? 0 : 1;
        drawModeOperations.get(this.#drawMode)?.onStart(this.#editorPlayfield, playFieldX, playFieldY, value);

        this.updateCanvasFromEditorPlayfield();

        this.document.addEventListener('mousemove', this.mouseMoveHandler);
        this.document.addEventListener('mouseup', this.mouseUpHandler);
    }

    mouseMove(e) {
        e.preventDefault();
        const { playFieldX, playFieldY } = this.getPlayfieldCoordinatesFromMousePosition(e.pageX, e.pageY);
        if (playFieldX !== this.#lastX || playFieldY !== this.#lastY) {
            const value = e.buttons & 2 ? 0 : 1;
            this.#lastX = playFieldX;
            this.#lastY = playFieldY;
            drawModeOperations
                .get(this.#drawMode)
                ?.onMove(this.#intialPlayfield, this.#startX, this.#startY, this.#editorPlayfield, playFieldX, playFieldY, value);

            this.updateCanvasFromEditorPlayfield();
        }
    }

    mouseUp(e) {
        this.document.removeEventListener('mousemove', this.mouseMoveHandler);
        this.document.removeEventListener('mouseup', this.mouseUpHandler);
        this.#intialPlayfield = undefined;
        this.#pushUndo();
        this.eventHandler.sendChangePlayfieldData(this.#editorPlayfield.id, this.#editorPlayfield.data);
    }
}
