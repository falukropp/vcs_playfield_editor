import { Playfield } from './playfield.js';
import { COMMANDS } from './custom_event_handler.js';

export class GameData {
    #palette = [];
    #map = [];
    #currentlySelected;
    #currentlySelectedMap;
    #eventHandler;
    #playfieldHeight;
    #nextId;

    constructor(eventHandler, playfieldHeight, initialPalette = [], initialMap = []) {
        this.#eventHandler = eventHandler;
        this.#playfieldHeight = playfieldHeight;
        this.#palette = initialPalette;
        this.#map = initialMap;
        this.#nextId = 0;

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

        this.#eventHandler.addEventListener(COMMANDS.MOVE_MAP, (e) => {
            this.#moveMap(e.detail.fromIdx, e.detail.toIdx);
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
            this.currentlySelectedMap = e.detail.idx;
        });

        this.#eventHandler.addEventListener(COMMANDS.SET_STATE, (e) => {
            this.#setState(e.detail.state);
        });
    }

    #getState() {
        return {
            currentlySelectedMap: this.#currentlySelectedMap,
            currentlySelected: this.#currentlySelected,
            map: [...this.#map],
            palette: this.#palette?.map((p) => p.getState()) ?? [],
            playfieldHeight: this.#playfieldHeight,
            nextId: this.#nextId,
        };
    }

    #setState(state) {
        this.#currentlySelectedMap = state.currentlySelectedMap;
        this.#currentlySelected = state.currentlySelected;
        // Deserialize these better... Also need to update nextId...
        this.#map = [...state.#map];
        this.#palette = state.#palette;
        this.#playfieldHeight = state.playfieldHeight;
        this.#nextId = state.nextId;

        this.sendStateSet(state);
    }

    addPlayfield(height, id) {
        const newId = ++this.#nextId;
        const newPlayField = id === undefined ? new Playfield(newId, height) : this.#getPlayField(id)?.copy(newId);
        if (!newPlayField) return;
        this.#palette.push(newPlayField);
        if (this.currentlySelected === undefined) {
            this.currentlySelected = newPlayField.id;
        }
        this.#eventHandler.sendPlayfieldAdded(newPlayField.id, this.#palette.length - 1);
    }

    deletePlayfield(id) {
        if (this.#palette.length <= 1) return;

        this.#palette = this.#palette.filter((p) => p.id !== id);
        this.#map = this.#map.filter((mapId) => mapId !== id);

        this.#eventHandler.sendPlayFieldDeleted(id);

        if (this.currentlySelected === id) {
            this.currentlySelected = this.#palette[0].id;
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
        return this.#getPlayField(id)?.copy();
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

    #moveMap(fromIdx, toIdx) {
        if (fromIdx === toIdx) return;
        // Disallow these edge-cases. Don't want to be dependent on implementation details for handling them.
        if (fromIdx < 0 || fromIdx >= this.#map.length) return;
        if (toIdx < 0 || toIdx >= this.#map.length) return;

        const id = this.#map[fromIdx];
        this.#map.splice(fromIdx, 1);
        this.#map.splice(toIdx, 0, id);

        this.#eventHandler.sendMapMoved(fromIdx, toIdx);
    }

    #deleteMap(idx) {
        this.#map.splice(idx, 1);
        this.#eventHandler.sendMapDeleted(idx);
    }

    getMap() {
        return [...this.#map];
    }

    getPlayfieldIdAtMapIdx(idx) {
        return this.#map[idx];
    }

    getMapLength() {
        return this.#map.length;
    }
}
