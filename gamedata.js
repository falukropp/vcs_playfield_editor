import { Playfield } from './playfield.js';
import { COMMANDS } from './custom_event_handler.js';

export class GameData {
    #palette = [];
    #map = [];
    #currentlySelected;
    #currentlySelectedMap;
    #eventHandler;
    #playfieldHeight;

    constructor(eventHandler, playfieldHeight) {
        this.#eventHandler = eventHandler;
        this.#playfieldHeight = playfieldHeight;

        this.addPlayfield(this.#playfieldHeight);

        this.#eventHandler.addEventListener(COMMANDS.ADD_PLAYFIELD, (e) => {
            this.addPlayfield(this.#playfieldHeight, e.detail.id);
        });

        this.#eventHandler.addEventListener(COMMANDS.ADD_TO_MAP, (e) => {
            this.#addMap(e.detail.id, e.detail.idx);
        });

        this.#eventHandler.addEventListener(COMMANDS.DELETE_FROM_MAP, (e) => {
            this.#deleteMap(e.detail.idx);
        });

        this.#eventHandler.addEventListener(COMMANDS.DELETE_PLAYFIELD, (e) => {
            this.deletePlayfield(e.detail.id);
        });

        this.#eventHandler.addEventListener(COMMANDS.CHANGE_PLAYFIELD_DATA, (e) => {
            this.setData(e.detail.data, e.detail.id);
        });

        this.#eventHandler.addEventListener(COMMANDS.CHANGE_PLAYFIELD_STATE, (e) => {
            this.#setModeAndReqisterMode(e.detail.playfieldMode, e.detail.registerModes, e.detail.id);
        });

        this.#eventHandler.addEventListener(COMMANDS.SELECT_PLAYFIELD, (e) => {
            this.currentlySelected = e.detail.id;
        });

        this.#eventHandler.addEventListener(COMMANDS.SELECT_MAP, (e) => {
            this.currentlySelectMap = e.detail.idx;
        });
    }

    addPlayfield(height, id) {
        const newPlayField = id === undefined ? new Playfield(height) : this.#getPlayField(id)?.copy();
        if (!newPlayField) return;
        this.#palette.push(newPlayField);
        if (this.#currentlySelected === undefined) {
            this.currentlySelected = newPlayField.id;
        }
        this.#eventHandler.sendPlayfieldAdded(newPlayField.id, this.#palette.length - 1);
    }

    deletePlayfield(id) {
        if (this.#palette.length <= 1) return;

        this.#palette = this.#palette.filter((p) => p.id !== id);
        this.#map = this.#map.filter((mapId) => mapId !== idx);

        this.#eventHandler.sendPlayFieldDeleted(id);

        if (this.#currentlySelected === id) {
            this.#currentlySelected = this.#palette[0].id;
            this.#eventHandler.sendPlayFieldSelected(this.#currentlySelected);
        }
    }

    get currentlySelected() {
        return this.#currentlySelected;
    }

    set currentlySelected(id) {
        if (this.#palette.some((p) => p.id === id)) {
            this.#currentlySelected = id;
            this.#eventHandler.sendPlayFieldSelected(id);
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
            this.#eventHandler.sendPlayfieldDataChanged(id, data);
        }
    }

    #setModeAndReqisterMode(mode, registerModes, id = this.#currentlySelected) {
        const playfield = this.#getPlayField(id);
        if (playfield) {
            playfield.mode = mode;
            playfield.setRegisterModes(registerModes);
            this.#eventHandler.sendPlayfieldStateChanged(id, registerModes, mode);
        }
    }

    setRegisterMode(registerModes, id = this.#currentlySelected) {
        const playfield = this.#getPlayField(id);
        if (playfield) {
            const mode = playfield.mode;
            playfield.setRegisterModes(registerModes);
            this.#eventHandler.sendPlayfieldStateChanged(id, registerModes, mode);
        }
    }

    setMode(mode, id = this.#currentlySelected) {
        const playfield = this.#getPlayField(id);
        if (playfield) {
            playfield.mode = mode;
            const registerModes = playfield.getRegisterModes();
            playfield.sendPlayfieldStateChanged(id, registerModes, mode);
        }
    }

    setRegisterMode(registerModes, id = this.#currentlySelected) {
        this.#getPlayField(id)?.setRegisterModes(registerModes);
        this.#eventHandler.sendPlayfieldDataChanged(id, data);
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

    get currentlySelectedMap() {
        return this.#currentlySelectedMap;
    }

    set currentlySelectedMap(idx) {
        if (idx < this.#map.length) {
            this.#currentlySelectedMap = idx;
            this.#eventHandler.sendMapSelected(idx);
        }
    }

    #addMap(id, idx) {
        if (this.#getPlayField(id)) {
            this.#map.splice(idx ?? 0, 0, id);
            this.#eventHandler.sendMapAdded(id, idx);
        }
    }

    #deleteMap(idx) {
        this.#map.splice(idx, 1);
        this.#eventHandler.sendMapDeleted(idx);
    }

    getMap() {
        return [...map];
    }

    getPlayfieldIdAtMapIdx(idx) {
        return this.#map[idx];
    }
}
