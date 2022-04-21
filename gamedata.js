import { Playfield } from './playfield.js';
import { COMMANDS } from './custom_event_handler.js';

export class GameData {
    #palette = [];
    #map = [];
    #currentlySelected;
    #eventHandler;
    #playfieldHeight;

    constructor(eventHandler, playfieldHeight) {
        this.#eventHandler = eventHandler;
        this.#playfieldHeight = playfieldHeight

        this.addPlayfield(this.#playfieldHeight);

        this.#eventHandler.addEventListener(COMMANDS.CHANGE_PLAYFIELD_DATA, (e) => {
            this.setData(e.detail.data, e.detail.id);
        });

        this.#eventHandler.addEventListener(COMMANDS.ADD_PLAYFIELD, (e) => {
            this.addPlayfield(this.#playfieldHeight);
        });
    }

    addPlayfield(height) {
        const newPlayField = new Playfield(height);
        this.#palette.push(newPlayField);
        if (!this.#currentlySelected) {
            this.#currentlySelected = newPlayField.id;
        }
        this.#eventHandler.sendPlayfieldAdded(newPlayField.id, this.#palette.length-1)
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

    getIdxOfId(id) {
        return this.#palette.findIndex((p) => p.id === id);
    }


    setData(data, id = this.#currentlySelected) {
        const playfield = this.#getPlayField(id);
        if (playfield) {
            playfield.data = data;
            this.#eventHandler.sendPlayfieldDataChanged(id, data)
        }
    }

    setMode(mode, id = this.#currentlySelected) {
        this.#getPlayField(id)?.setMode(mode);
        this.#eventHandler.sendPlayfieldDataChanged(id, data)
    }

    setRegisterMode(registerModes, id = this.#currentlySelected) {
        this.#getPlayField(id)?.setRegisterModes(registerModes);
        this.#eventHandler.sendPlayfieldDataChanged(id, data)
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

    getPaletteDataAtIdx(idx) {
        return this.#palette[idx].data;
    }

    getPlayfieldIdAtIdx(idx) {
        return this.#palette[idx].id;
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
