import { Playfield } from './playfield.js';
export class Editor {
    #undos;
    #currentUndoLevel;

    constructor(document, canvas, playfield) {
        this.document = document;
        this.canvas = canvas;
        this.playfield = playfield;
        this.#updateGUIFromPlayfield()
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

    #pushUndo() {
        const undosForCurrentPlayfield = this.#undos.get(this.playfield)?.slice(0, this.#currentUndoLevel + 1) ?? [];
        undosForCurrentPlayfield.push(new Playfield(this.playfield.height, this.playfield.mode, this.playfield.data, this.playfield.getRegisterModes()));
        this.#currentUndoLevel = undosForCurrentPlayfield.length - 1;
        this.#undos.set(this.playfield, undosForCurrentPlayfield);
    }

    #updateGUIFromPlayfield() {
        const registerModes = this.playfield.getRegisterModes();
        const playfieldMode = this.playfield.mode;
        const event = new CustomEvent('editorStateChanged', { detail: { registerModes, playfieldMode } });
        this.document.dispatchEvent(event);
    }

    #setPlayfieldFromUndo() {
        const oldPlayfield = this.#undos.get(this.playfield)[this.#currentUndoLevel];
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

    #drawPixel(mouseX, mouseY, value) {
        const { playFieldX, playFieldY } = this.getPlayfieldCoordinatesFromMousePosition(mouseX, mouseY);
        this.#drawVcsPixel(playFieldX, playFieldY, value);
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

    mouseDown(e) {
        e.preventDefault();
        this.#drawPixel(e.pageX, e.pageY, e.buttons & 2 ? 0 : 1);

        this.document.addEventListener('mousemove', this.mouseMoveHandler);
        this.document.addEventListener('mouseup', this.mouseUpHandler);
    }

    mouseMove(e) {
        e.preventDefault();
        this.#drawPixel(e.pageX, e.pageY, e.buttons & 2 ? 0 : 1);
    }

    mouseUp(e) {
        this.document.removeEventListener('mousemove', this.mouseMoveHandler);
        this.document.removeEventListener('mouseup', this.mouseUpHandler);
        this.#pushUndo();
    }
}
