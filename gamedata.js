export class GameData {
    #palette = [];
    #map = [];
    
    addPlayfield(playfield) {
        this.#palette.push(playfield);
    }
    removePlayField(idx) {
        this.#palette.splice(idx, 1);
        this.#map = this.#map.filter((mapIdx) => mapIdx !== idx);
        this.#map = this.#map.map((mapIdx) => (mapIdx > idx ? --mapIdx : mapIdx));
    }
    removeMap(idx) {
        this.#map.splice(idx, 1);
    }

    getPaletteData() {
        return this.#palette.map((p) => p.data);
    }

    getMap() {
        return [...map];
    }
}
