import { Playfield } from './playfield.js';

export class GameData {
    #palette = [];
    #map = [];
    #currentlySelected;

    addPlayfield(height, mode, data, registerModes) {
        const newPlayField = new Playfield(height, mode, data, registerModes);
        this.#palette.push(newPlayField);
        this.#currentlySelected ??= newPlayField.id;
    }

    removePlayField(id) {
        this.#palette = this.#palette.filter((p) => p.id !== id);
        this.#map = this.#map.filter((mapId) => mapId !== idx);
        if (this.#currentlySelected === id) this.#currentlySelected = undefined;
    }

    get currentlySelected() {
        return this.#currentlySelected;
    }

    set currentlySelected(id) {
        if (this.#palette.some((p) => p.id === id)) {
            this.#currentlySelected = id;
        }
    }

    #getPlayField(id) {
        return this.#palette.find((p) => p.id === id);
    }

    setData(data, id = this.#currentlySelected) {
        const playfield = this.#getPlayField(id);
        if (playfield) {
            playfield.data = data;
        }
    }

    setMode(mode, id = this.#currentlySelected) {
        this.#getPlayField(id)?.setMode(mode);
    }

    setRegisterMode(registerModes, id = this.#currentlySelected) {
        this.#getPlayField(id)?.setRegisterModes(registerModes);
    }

    removeMap(idx) {
        this.#map.splice(idx, 1);
    }

    clonePlayfield(id = this.#currentlySelected) {
        return this.#getPlayField(id)?.clone();
    }

    getPaletteData(id = this.#currentlySelected) {
        return this.#getPlayField(id)?.data;
    }

    getMode(id = this.#currentlySelected) {
        return this.#getPlayField(id)?.mode;
    }

    getRegisterModes(id = this.#currentlySelected) {
        return this.#getPlayField(id)?.getRegisterModes();
    }

    getAllPaletteData() {
        return this.#palette.map((p) => p.data);
    }

    getPaletteDataSize() {
        return this.#palette.length;
    }

    getMap() {
        return [...map];
    }
}
