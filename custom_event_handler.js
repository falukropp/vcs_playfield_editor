export const COMMANDS = {    
    ADD_PLAYFIELD: 'ADD_PLAYFIELD',
    DELETE_PLAYFIELD: 'DELETE_PLAYFIELD',
    CHANGE_PLAYFIELD_DATA: 'CHANGE_PLAYFIELD_DATA',
    CHANGE_PLAYFIELD_STATE: 'CHANGE_PLAYFIELD_STATE',
    SELECT_PLAYFIELD: 'SELECT_PLAYFIELD',
};


export const EVENTS = {    
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

    sendDeletePlayField(id) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.DELETE_PLAYFIELD, {detail : {id}}));
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
