import { EVENTS } from './custom_event_handler.js';

export class Map {
    #mapPlayfieldsArea;

    #gameData;
    #eventHandler;

    #canvasWidth = 40;
    #canvasHeight = 32;

    constructor(document, eventHandler, gameData) {
        this.#mapPlayfieldsArea = document.getElementById('map-playfields');

        this.#gameData = gameData;
        this.#eventHandler = eventHandler;

        this.#redrawWholeMap();

        this.#mapPlayfieldsArea.addEventListener('click', (e) => {
            const target = e.target;
            if (target.nodeName !== 'CANVAS') return;
            const idx = [...target.parentElement.children].indexOf(target);
            this.#eventHandler.sendSelectMap(idx);
        });

        document.getElementById('add-to-map').addEventListener('click', () => {
            this.#eventHandler.sendAddToMap(this.#gameData.currentlySelected, this.#gameData.currentlySelectedMap);
        });

        document.getElementById('remove-from-map').addEventListener('click', () => {
            this.#eventHandler.sendRemoveFromMap(this.#gameData.currentlySelectedMap);
        });

        this.#eventHandler.addEventListener(EVENTS.PLAYFIELD_DATA_CHANGED, (e) => {
            this.redrawGameData(e.detail.id);
        });

        this.#eventHandler.addEventListener(EVENTS.MAP_ADDED, (e) => {
            this.#addMap(e.detail.id, e.detail.ix);
        });

        this.#eventHandler.addEventListener(EVENTS.MAP_SELECTED, (e) => {
            this.#selectMap(e.detail.idx);
        });

        this.#eventHandler.addEventListener(EVENTS.MAP_DELETED, (e) => {
            this.#deleteMap(e.detail.idx);
        });
    }

    #redrawMapIdx(idx) {
        const playFieldId = this.#gameData.getPlayfieldIdAtMapIdx(idx);
        const data = this.#gameData.getPaletteData(playFieldId);

        const canvas = this.#mapPlayfieldsArea.getElementsByTagName('canvas').item(idx);
        if (!canvas) return;
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

    #appendCanvas() {
        this.#palettePlayfieldsArea.insertAdjacentHTML('beforeEnd', `<canvas width="${this.#canvasWidth}" height="${this.#canvasHeight}"></canvas>`);
    }

    #redrawWholeMap() {
        const map = this.#gameData.getMap();
        const mapEntries = map.length;

        const canvases = this.#mapPlayfieldsArea.getElementsByTagName('canvas');
        const currentNumberOfCanvases = canvases.length;

        for (let canvasIdx = 0; canvasIdx < numberOfPaletteEntries; ++canvasIdx) {
            this.#redrawMapIdx(canvasIdx);
        }

        if (numberOfPaletteEntries > currentNumberOfCanvases) {
            for (let childIdx = currentNumberOfCanvases; childIdx < numberOfPaletteEntries; ++childIdx) {
                this.#appendCanvas();
                this.#redrawMapIdx(childIdx);
            }
        }
    }

    #addMap(id, idx) {
        if(!idx) {
            this.#appendCanvas();
            this.#redrawMapIdx();
        }
        const canvas = this.#mapPlayfieldsArea.getElementsByTagName('canvas').item(idx);
        if (!canvas) {

        }
        this.#redrawMapIdx(idx)
    }

    #deleteMap(idx) {
        const canvas = this.#mapPlayfieldsArea.getElementsByTagName('canvas').item(idx);
        if(canvas) {
            this.#mapPlayfieldsArea.remove(canvas);
        }
    }
}
