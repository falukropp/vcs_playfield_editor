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
                for (let fx = -x; fx >= 0 ; --fx) {
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

export class Editor {
    #undos;
    #currentUndoLevel;
    #drawMode;

    constructor(document, eventHandler, canvas, playfield) {
        this.document = document;
        this.eventHandler = eventHandler;
        this.canvas = canvas;
        this.playfield = playfield;
        this.#drawMode = DrawMode.SCRIBBLE;
        this.#updateGUIFromPlayfield();
        this.#undos = new Map(); // <number, Playfield[]>
        this.#currentUndoLevel = 0;

        this.#pushUndo();

        this.canvasRowsPerVcsPixel = this.canvas.height / playfield.height;
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
                        row * this.canvasRowsPerVcsPixel,
                        this.canvasColumnsPerVcsPixel,
                        this.canvasRowsPerVcsPixel
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
        const undosForCurrentPlayfield = this.#undos.get(this.playfield.id)?.slice(0, this.#currentUndoLevel + 1) ?? [];
        undosForCurrentPlayfield.push(this.playfield.clone());
        this.#currentUndoLevel = undosForCurrentPlayfield.length - 1;
        this.#undos.set(this.playfield.id, undosForCurrentPlayfield);
    }

    #updateGUIFromPlayfield() {
        const registerModes = this.playfield.getRegisterModes();
        const playfieldMode = this.playfield.mode;
        this.eventHandler.sendEditorStateChanged(registerModes, playfieldMode, this.#drawMode);
        this.eventHandler.sendEditorDataChanged(this.playfield.data);
    }

    #getPlayfieldFromUndo() {
        return this.#undos.get(this.playfield.id)[this.#currentUndoLevel];
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
        if (this.#currentUndoLevel < this.#undos.get(this.playfield.id)?.length - 1) {
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
        this.eventHandler.sendEditorDataChanged(this.playfield.data);
    }
}
