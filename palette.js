import { EVENTS } from './custom_event_handler.js';

export class Palette {
    #paletteArea;
    #addNewPlayfieldButton;

    #gameData;
    #eventHandler;

    #canvasWidth = 40;
    #canvasHeight = 32;

    constructor(document, eventHandler, gameData) {
        this.#paletteArea = document.getElementById('palette');
        this.#addNewPlayfieldButton = document.getElementById('add-new-playfield');

        this.#gameData = gameData;
        this.#eventHandler = eventHandler;
        this.redrawAllGameData();

        this.#paletteArea.addEventListener('click', (e) => {
            const target = e.target;
            if (target.nodeName !== 'CANVAS') return;
            const targetPlayfieldId = target.dataset.playfieldId;
            if (targetPlayfieldId === gameData.currentlySelected) return;

            [...document.getElementsByClassName('selectedPlayField')].forEach((e) => e.classList.remove('selectedPlayField'));
            gameData.currentlySelected = targetPlayfieldId;
            target.classList.add('selectedPlayField');
        });

        document.getElementById('add-new-playfield').addEventListener('click', () => {
            this.#eventHandler.sendAddPlayField();
        });

        this.#eventHandler.addEventListener(EVENTS.PLAYFIELD_DATA_CHANGED, (e) => {
            this.redrawGameData(e.detail.id);
        });

        this.#eventHandler.addEventListener(EVENTS.PLAYFIELD_ADDED, (e) => {
            this.#addNewPlayField(e.detail.id);
        });
    }

    redrawGameData(id) {
        const idx = this.#gameData.getIdxOfId(id);
        if (idx !== -1) {
            const canvases = this.#paletteArea.getElementsByTagName('canvas');
            this.#updateCanvas(this.#gameData.getPaletteDataAtIdx(idx), canvases[idx]);
        }
    }

    #addNewPlayField(playFieldId) {
        this.#addNewPlayfieldButton.insertAdjacentHTML(
            'beforeBegin',
            `<canvas width="${this.#canvasWidth}" height="${this.#canvasHeight}" data-playfieldId="${playFieldId}"></canvas>`
        );
    }

    redrawAllGameData() {
        const paletteEntries = this.#gameData.getAllPaletteData();
        const numberOfPaletteEntries = paletteEntries.length;

        const canvases = this.#paletteArea.getElementsByTagName('canvas');
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

        /*
        Handle removals elsewhere.
        } else if (paletteEntries < currentNumberOfCanvases) {
            for (const childIdx = paletteEntries; childIdx < currentNumberOfCanvases; ++childIdx) {
                this.#paletteArea.removeChild(currentCanvases[childIdx])
            }
        }
        */
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
