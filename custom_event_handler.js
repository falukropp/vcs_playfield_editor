export const COMMANDS = {    
    ADD_PLAYFIELD: 'ADD_PLAYFIELD',
    CHANGE_PLAYFIELD_DATA: 'CHANGE_PLAYFIELD_DATA',
    CHANGE_PLAYFIELD_STATE: 'CHANGE_PLAYFIELD_STATE',
};


export const EVENTS = {    
    PLAYFIELD_ADDED: 'PLAYFIELD_ADDED',
    PLAYFIELD_STATE_CHANGED: 'PLAYFIELD_STATE_CHANGED',
    PLAYFIELD_DATA_CHANGED: 'PLAYFIELD_DATA_CHANGED',
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

    sendAddPlayField() {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.ADD_PLAYFIELD));
    }
    
    sendPlayfieldAdded(id, idx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.PLAYFIELD_ADDED, {detail: {id, idx} }));
    }
    
    sendChangePlayfieldState(registerModes, playfieldMode, drawMode) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.CHANGE_PLAYFIELD_STATE, { detail: { registerModes, playfieldMode, drawMode } }));
    }

    sendPlayfieldStateChanged(registerModes, playfieldMode, drawMode) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.PLAYFIELD_STATE_CHANGED, { detail: { registerModes, playfieldMode, drawMode } }));
    }

    sendChangePlayfieldData(id, data) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.CHANGE_PLAYFIELD_DATA, { detail: {id, data} }));
    }

    sendPlayfieldDataChanged(id, data) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.PLAYFIELD_DATA_CHANGED, { detail: {id, data} }));
    }
}
