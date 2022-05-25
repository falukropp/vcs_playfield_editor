export const COMMANDS = {    
    ADD_PLAYFIELD: 'ADD_PLAYFIELD',
    ADD_TO_MAP: 'ADD_TO_MAP',
    CHANGE_PLAYFIELD_DATA: 'CHANGE_PLAYFIELD_DATA',
    CHANGE_PLAYFIELD_STATE: 'CHANGE_PLAYFIELD_STATE',
    DELETE_PLAYFIELD: 'DELETE_PLAYFIELD',
    DELETE_FROM_MAP: 'DELETE_FROM_MAP',
    MOVE_MAP: 'MOVE_MAP',
    SELECT_PLAYFIELD: 'SELECT_PLAYFIELD',
    SELECT_MAP: 'SELECT_MAP',
};


export const EVENTS = {    
    MAP_ADDED: 'MAP_ADDED',
    MAP_DELETED: 'MAP_DELETED',
    MAP_MOVED: 'MAP_MOVED',
    MAP_SELECTED: 'MAP_SELECTED',
    PLAYFIELD_ADDED: 'PLAYFIELD_ADDED',
    PLAYFIELD_DELETED: 'PLAYFIELD_DELETED',
    PLAYFIELD_STATE_CHANGED: 'PLAYFIELD_STATE_CHANGED',
    PLAYFIELD_DATA_CHANGED: 'PLAYFIELD_DATA_CHANGED',
    PLAYFIELD_SELECTED: 'PLAYFIELD_SELECTED',
};

export class CustomEventHandler {
    #eventTarget;

    constructor(eventTarget) {
        // Delegate implementation to some existing eventTarget, like document
        this.#eventTarget = eventTarget;
    }

    addEventListener(event, fn) {
        // could maybe check if event is correct, etc.
        this.#eventTarget.addEventListener(event, fn);
    }

    sendMoveMap(fromIdx, toIdx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.MOVE_MAP, {detail : {fromIdx, toIdx}}));
    }

    sendMapMoved(fromIdx, toIdx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.MAP_MOVED, {detail : {fromIdx, toIdx}}));
    }

    sendAddToMap(id, idx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.ADD_TO_MAP, {detail : {id, idx}}));
    }

    sendDeleteFromMap(idx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.DELETE_FROM_MAP, {detail : {idx}}));
    }

    sendSelectMap(idx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.SELECT_MAP, {detail : {idx}}));
    }

    sendMapAdded(id, idx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.MAP_ADDED, {detail : {id, idx}}));
    }

    sendMapDeleted(idx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.MAP_DELETED, {detail : {idx}}));
    }

    sendMapSelected(idx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.MAP_SELECTED, {detail : {idx}}));
    }


    sendDeletePlayField(id) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.DELETE_PLAYFIELD, {detail : {id}}));
    }

    sendPlayFieldDeleted(id) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.PLAYFIELD_DELETED, {detail : {id}}));
    }

    sendSelectPlayField(id) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.SELECT_PLAYFIELD, {detail : {id}}));
    }

    sendPlayFieldSelected(id) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.PLAYFIELD_SELECTED, {detail : {id}}));
    }

    sendAddPlayField(id) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.ADD_PLAYFIELD, {detail : {id}}));
    }
    
    sendPlayfieldAdded(id, idx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.PLAYFIELD_ADDED, {detail: {id, idx} }));
    }
    
    sendPlayfieldAdded(id, idx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.PLAYFIELD_ADDED, {detail: {id, idx} }));
    }
    
    sendChangePlayfieldState(id, registerModes, playfieldMode) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.CHANGE_PLAYFIELD_STATE, { detail: { id, registerModes, playfieldMode} }));
    }

    sendPlayfieldStateChanged(id, registerModes, playfieldMode) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.PLAYFIELD_STATE_CHANGED, { detail: { id, registerModes, playfieldMode} }));
    }

    sendChangePlayfieldData(id, data) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.CHANGE_PLAYFIELD_DATA, { detail: {id, data} }));
    }

    sendPlayfieldDataChanged(id, data) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.PLAYFIELD_DATA_CHANGED, { detail: {id, data} }));
    }
}
