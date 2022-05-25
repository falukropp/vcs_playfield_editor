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

        document.getElementById('delete-from-map').addEventListener('click', () => {
            this.#eventHandler.sendDeleteFromMap(this.#gameData.currentlySelectedMap);
        });

        document.getElementById('move-map-up').addEventListener('click', () => {
            const mapIdx = this.#gameData.currentlySelectedMap;
            if (mapIdx > 0) {
                this.#eventHandler.sendMoveMap(mapIdx, mapIdx - 1);
                this.#eventHandler.sendSelectMap(mapIdx - 1);
            }
        });

        document.getElementById('move-map-down').addEventListener('click', () => {
            const mapIdx = this.#gameData.currentlySelectedMap;
            if (mapIdx < this.#gameData.getMapLength() - 1) {
                this.#eventHandler.sendMoveMap(mapIdx, mapIdx + 1);
                this.#eventHandler.sendSelectMap(mapIdx + 1);
            }
        });

        this.#eventHandler.addEventListener(EVENTS.PLAYFIELD_DATA_CHANGED, (e) => {
            this.#redrawGameData(e.detail.id);
        });

        this.#eventHandler.addEventListener(EVENTS.MAP_ADDED, (e) => {
            this.#addMap(e.detail.id, e.detail.idx);
        });

        this.#eventHandler.addEventListener(EVENTS.MAP_MOVED, (e) => {
            this.#moveMap(e.detail.fromIdx, e.detail.toIdx);
        });

        this.#eventHandler.addEventListener(EVENTS.MAP_SELECTED, (e) => {
            this.#selectMap(e.detail.idx);
        });

        this.#eventHandler.addEventListener(EVENTS.MAP_DELETED, (e) => {
            this.#deleteMap(e.detail.idx);
        });
    }

    #redrawGameData(id) {
        this.#gameData.getMap().forEach((mapId, idx) => {
            if (mapId === id) this.#redrawMapIdx(idx);
        });
    }

    #redrawMapIdx(idx) {
        const playFieldId = this.#gameData.getPlayfieldIdAtMapIdx(idx);
        const data = this.#gameData.getPaletteData(playFieldId);

        const canvas = this.#getCanvasAtIndex(idx);
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

    #getNewCanvasCode() {
        return `<canvas width="${this.#canvasWidth}" height="${this.#canvasHeight}"></canvas>`;
    }

    #appendNewCanvas() {
        this.#mapPlayfieldsArea.insertAdjacentHTML('beforeEnd', this.#getNewCanvasCode());
    }

    #redrawWholeMap() {
        const mapEntries = this.#gameData.getMapLength();
        const currentNumberOfCanvases = this.#getCanvases().length;

        for (let canvasIdx = 0; canvasIdx < mapEntries; ++canvasIdx) {
            this.#redrawMapIdx(canvasIdx);
        }

        if (mapEntries > currentNumberOfCanvases) {
            for (let childIdx = currentNumberOfCanvases; childIdx < mapEntries; ++childIdx) {
                this.#appendNewCanvas();
                this.#redrawMapIdx(childIdx);
            }
        }
    }

    #addMap(id, idx) {
        const canvas = this.#getCanvasAtIndex(idx);
        let idxToRedraw;
        if (!canvas) {
            this.#appendNewCanvas();
            idxToRedraw = 0;
        } else {
            canvas.insertAdjacentHTML('beforebegin', this.#getNewCanvasCode());
            idxToRedraw = idx;
        }
        this.#redrawMapIdx(idxToRedraw);
        this.#eventHandler.sendSelectMap(idxToRedraw);
    }

    // Returns undefined if idx undefined or out-of-bounds.
    #getCanvasAtIndex(idx) {
        return this.#getCanvases()[idx];
    }

    #getCanvases() {
        return this.#mapPlayfieldsArea.getElementsByTagName('canvas');
    }

    #deleteMap(idx) {
        const canvas = this.#getCanvasAtIndex(idx);
        if (canvas) {
            this.#mapPlayfieldsArea.removeChild(canvas);
        }
    }

    #moveMap(fromIdx, toIdx) {
        const canvases = this.#getCanvases();
        if (fromIdx > toIdx) {
            canvases[toIdx].insertAdjacentElement('beforebegin', canvases[fromIdx]);
        } else {
            canvases[toIdx].insertAdjacentElement('afterend', canvases[fromIdx]);
        }
    }

    #selectMap(idx) {
        [...this.#mapPlayfieldsArea.querySelectorAll('.selectedMap')].forEach((e) => e.classList.remove('selectedMap'));
        this.#getCanvasAtIndex(idx)?.classList.add('selectedMap');
    }
}
