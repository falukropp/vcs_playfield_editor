import { Playfield } from './playfield.js';

export const DrawMode = {
    SCRIBBLE: 'SCRIBBLE',
    LINE: 'LINE',
    FILLED_RECT: 'FILLED_RECT',
    RECT: 'RECT',
    FILLED_CIRCLE: 'FILLED_CIRCLE',
    CIRCLE: 'CIRCLE',
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

export class Editor {
    #undos;
    #currentUndoLevel;
    #drawMode;

    constructor(document, canvas, playfield) {
        this.document = document;
        this.canvas = canvas;
        this.playfield = playfield;
        this.#drawMode = DrawMode.SCRIBBLE;
        this.#updateGUIFromPlayfield();
        this.#undos = new WeakMap(); // <Playfield, Playfield[]>
        this.#currentUndoLevel = 0;

        this.#pushUndo();

        this.canvasRowsPerPVcsPixel = this.canvas.height / playfield.height;
        this.canvasColumnsPerVcsPixel = this.canvas.width / playfield.width;

        this.mouseDownHandler = (e) => this.mouseDown(e);
        this.mouseMoveHandler = (e) => this.mouseMove(e);
        this.mouseUpHandler = (e) => this.mouseUp(e);

        canvas.addEventListener('mousedown', this.mouseDownHandler);
    }

    updateCanvas() {
        const data = this.playfield.data;
        const context = this.canvas.getContext('2d');

        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.fillStyle = 'orange';

        for (let row = 0; row < this.playfield.height; ++row) {
            for (let col = 0; col < this.playfield.width; ++col) {
                if (data[row][col]) {
                    context.fillRect(
                        col * this.canvasColumnsPerVcsPixel,
                        row * this.canvasRowsPerPVcsPixel,
                        this.canvasColumnsPerVcsPixel,
                        this.canvasRowsPerPVcsPixel
                    );
                }
            }
        }
    }

    setDrawMode(mode) {
        this.#drawMode = mode;
        this.#updateGUIFromPlayfield();
    }

    #pushUndo() {
        const undosForCurrentPlayfield = this.#undos.get(this.playfield)?.slice(0, this.#currentUndoLevel + 1) ?? [];
        undosForCurrentPlayfield.push(this.playfield.copy());
        this.#currentUndoLevel = undosForCurrentPlayfield.length - 1;
        this.#undos.set(this.playfield, undosForCurrentPlayfield);
    }

    #updateGUIFromPlayfield() {
        const registerModes = this.playfield.getRegisterModes();
        const playfieldMode = this.playfield.mode;
        const event = new CustomEvent('editorStateChanged', { detail: { registerModes, playfieldMode, drawMode: this.#drawMode } });
        this.document.dispatchEvent(event);
    }

    #getPlayfieldFromUndo() {
        return this.#undos.get(this.playfield)[this.#currentUndoLevel];
    }

    #setPlayfieldFromUndo() {
        const oldPlayfield = this.#getPlayfieldFromUndo();
        this.playfield.height = oldPlayfield.height;
        this.playfield.mode = oldPlayfield.mode;
        this.playfield.data = oldPlayfield.data;
        this.playfield.setRegisterModes(oldPlayfield.getRegisterModes());

        this.#updateGUIFromPlayfield();
        this.updateCanvas();
    }

    undo() {
        if (this.#currentUndoLevel > 0) {
            this.#currentUndoLevel--;
            this.#setPlayfieldFromUndo();
        }
    }

    redo() {
        if (this.#currentUndoLevel < this.#undos.get(this.playfield)?.length - 1) {
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
            playFieldY: Math.floor(canvasY / this.canvasRowsPerPVcsPixel),
        };
    }

    #drawVcsPixel(x, y, value) {
        if (this.playfield.swapPixel(x, y, value) !== value) {
            this.updateCanvas();
        }
    }

    setEditorMode(newMode) {
        if (newMode != this.playfield.mode) {
            this.playfield.mode = newMode;
            this.updateCanvas();
            this.#pushUndo();
            this.#updateGUIFromPlayfield();
        }
    }

    setRegisterMode(register, newMode) {
        this.playfield.setRegisterMode(register, newMode);
        this.updateCanvas();
        this.#pushUndo();
        this.#updateGUIFromPlayfield();
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
        drawModeOperations.get(this.#drawMode)?.onStart(this.playfield, playFieldX, playFieldY, value);

        this.updateCanvas();

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
            drawModeOperations.get(this.#drawMode)?.onMove(this.#intialPlayfield, this.#startX, this.#startY, this.playfield, playFieldX, playFieldY, value);

            this.updateCanvas();
        }
    }

    mouseUp(e) {
        this.document.removeEventListener('mousemove', this.mouseMoveHandler);
        this.document.removeEventListener('mouseup', this.mouseUpHandler);
        this.#intialPlayfield = undefined;
        this.#pushUndo();
    }
}
