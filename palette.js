import { EVENTS } from './custom_event_handler.js';

export class Palette {
    #palettePlayfieldsArea;

    #gameData;
    #eventHandler;

    #canvasWidth = 40;
    #canvasHeight = 32;

    constructor(document, eventHandler, gameData) {
        this.#palettePlayfieldsArea = document.getElementById('palette-playfields');

        this.#gameData = gameData;
        this.#eventHandler = eventHandler;
        this.redrawAllGameData();
        this.#setSelectedCanvas(this.#gameData.currentlySelected)

        this.#palettePlayfieldsArea.addEventListener('click', (e) => {
            const target = e.target;
            if (target.nodeName !== 'CANVAS') return;
            const targetPlayfieldId = parseInt(target.dataset.playfieldid);
            if (targetPlayfieldId === this.#gameData.currentlySelected) return;
            this.#eventHandler.sendSelectPlayField(targetPlayfieldId);
        });

        document.getElementById('add-new-playfield').addEventListener('click', () => {
            this.#eventHandler.sendAddPlayField();
        });

        document.getElementById('delete-playfield').addEventListener('click', () => {
            this.#eventHandler.deletePlayField();
        });

        document.getElementById('copy-playfield').addEventListener('click', () => {
            this.#eventHandler.sendAddPlayField(this.#gameData.currentlySelected);
        });

    
        this.#eventHandler.addEventListener(EVENTS.PLAYFIELD_DATA_CHANGED, (e) => {
            this.redrawGameData(e.detail.id);
        });

        this.#eventHandler.addEventListener(EVENTS.PLAYFIELD_SELECTED, (e) => {
            this.#setSelectedCanvas(e.detail.id)
        });

        this.#eventHandler.addEventListener(EVENTS.PLAYFIELD_ADDED, (e) => {
            this.#addNewPlayField(e.detail.id);
        });
    }

    #setSelectedCanvas(id) {
        [...document.getElementsByClassName('selectedPlayField')].forEach((e) => e.classList.remove('selectedPlayField'));
        const target = document.querySelector(`canvas[data-playfieldid='${id}']`)
        if (target) {
            target.classList.add('selectedPlayField');
        }
    }

    redrawGameData(id) {
        const idx = this.#gameData.getIdxOfId(id);
        if (idx !== -1) {
            const canvases = this.#palettePlayfieldsArea.getElementsByTagName('canvas');
            this.#updateCanvas(this.#gameData.getPaletteDataAtIdx(idx), canvases[idx]);
        }
    }

    #addNewPlayField(playFieldId) {
        this.#palettePlayfieldsArea.insertAdjacentHTML(
            'beforeEnd',
            `<canvas width="${this.#canvasWidth}" height="${this.#canvasHeight}" data-playfieldid="${playFieldId}"></canvas>`
        );
        this.redrawGameData(playFieldId);
    }

    redrawAllGameData() {
        const paletteEntries = this.#gameData.getAllPaletteData();
        const numberOfPaletteEntries = paletteEntries.length;

        const canvases = this.#palettePlayfieldsArea.getElementsByTagName('canvas');
        const currentNumberOfCanvases = canvases.length;

        if (numberOfPaletteEntries > currentNumberOfCanvases) {
            for (let childIdx = currentNumberOfCanvases; childIdx < numberOfPaletteEntries; ++childIdx) {
                const playFieldId = this.#gameData.getPlayfieldIdAtIdx(childIdx);
                this.#addNewPlayField(playFieldId);
            }
        }

        for (let canvasIdx = 0; canvasIdx < numberOfPaletteEntries; ++canvasIdx) {
            this.#updateCanvas(paletteEntries[canvasIdx], canvases[canvasIdx]);
        }
    }

    removePlayfield(idx) {}

    #updateCanvas(data, canvas) {
        const context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'orange';

        const dataWidth = data[0].length;
        const dataHeight = data.length;

        const canvasColumnsPerVcsPixel = this.#canvasWidth / dataWidth;
        const canvasRowsPerVcsPixel = this.#canvasHeight / dataHeight;

        for (let row = 0; row < dataHeight; ++row) {
            for (let col = 0; col < dataWidth; ++col) {
                if (data[row][col]) {
                    context.fillRect(col * canvasColumnsPerVcsPixel, row * canvasRowsPerVcsPixel, canvasColumnsPerVcsPixel, canvasRowsPerVcsPixel);
                }
            }
        }
    }
}
