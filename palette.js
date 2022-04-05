export class Palette {
    #paletteArea;
    #gameData;

    #canvasWidth = 40;
    #canvasHeight = 32;

    constructor(palettarea, gameData) {
        this.#paletteArea = palettarea;
        this.#gameData = gameData;
        this.redrawAllGameData()
    }

    redrawSelected() {

    }

    redrawAllGameData(start, end) {
        const paletteEntries = this.#gameData.getAllPaletteData();
        const numberOfPaletteEntries = paletteEntries.length;

        if (start === undefined || start < 0) start = 0;
        if (end === undefined || end > numberOfPaletteEntries) end = numberOfPaletteEntries;

        const canvases = this.#paletteArea.getElementsByTagName('canvas');
        const currentNumberOfCanvases = canvases.length;

        if (end > currentNumberOfCanvases) {
            const addNewPlayfieldButton = this.#paletteArea.ownerDocument.getElementById('add-new-playfield');
            for (let childIdx = currentNumberOfCanvases; childIdx < end; ++childIdx) {
                addNewPlayfieldButton.insertAdjacentHTML('beforeBegin', `<canvas width="${this.#canvasWidth}" height="${this.#canvasHeight}"></canvas>`);
            }
        }

        for (let canvasIdx = start; canvasIdx < end ; ++canvasIdx) {
            this.#updateCanvas(paletteEntries[canvasIdx], canvases[canvasIdx])
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

    selectPlayfield(idx) {}

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
