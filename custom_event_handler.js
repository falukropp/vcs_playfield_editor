export const COMMANDS = {
    ADD_PLAYFIELD: 'ADD_PLAYFIELD',
    ADD_TO_MAP: 'ADD_TO_MAP',
    CHANGE_PLAYFIELD_DATA: 'CHANGE_PLAYFIELD_DATA',
    CHANGE_PLAYFIELD_STATE: 'CHANGE_PLAYFIELD_STATE',
    DELETE_PLAYFIELD: 'DELETE_PLAYFIELD',
    DELETE_FROM_MAP: 'DELETE_FROM_MAP',
    LOAD_STATE: 'LOAD_STATE',
    MOVE_MAP: 'MOVE_MAP',
    SAVE_STATE: 'SAVE_STATE',
    SET_STATE: 'SET_STATE',
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
    STATE_LOADED: 'STATE_LOADED',
    STATE_SAVED: 'STATE_SAVED',
    STATE_SET: 'STATE_SET',
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

    addEventsListener(events, fn) {
        events.forEach((event) => this.#eventTarget.addEventListener(event, fn));
    }

    // -----------------------------------------------------------------------
    // Helpers for commands
    // -----------------------------------------------------------------------

    sendAddPlayField(id) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.ADD_PLAYFIELD, { detail: { id } }));
    }

    sendAddToMap(id, idx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.ADD_TO_MAP, { detail: { id, idx } }));
    }

    sendChangePlayfieldData(id, data) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.CHANGE_PLAYFIELD_DATA, { detail: { id, data } }));
    }

    sendChangePlayfieldState(id, registerModes, playfieldMode) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.CHANGE_PLAYFIELD_STATE, { detail: { id, registerModes, playfieldMode } }));
    }

    sendDeletePlayField(id) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.DELETE_PLAYFIELD, { detail: { id } }));
    }

    sendDeleteFromMap(idx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.DELETE_FROM_MAP, { detail: { idx } }));
    }

    sendLoadState(name) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.LOAD_STATE, { detail: { name } }));
    }

    sendMoveMap(fromIdx, toIdx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.MOVE_MAP, { detail: { fromIdx, toIdx } }));
    }

    sendSaveState(name, state) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.SAVE_STATE, { detail: { name, state } }));
    }

    sendSetState(state) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.SET_STATE, { detail: { state } }));
    }

    sendSelectMap(idx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.SELECT_MAP, { detail: { idx } }));
    }

    sendSelectPlayField(id) {
        this.#eventTarget.dispatchEvent(new CustomEvent(COMMANDS.SELECT_PLAYFIELD, { detail: { id } }));
    }

    // -----------------------------------------------------------------------
    // Helpers for events
    // -----------------------------------------------------------------------


    sendMapAdded(id, idx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.MAP_ADDED, { detail: { id, idx } }));
    }

    sendMapDeleted(idx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.MAP_DELETED, { detail: { idx } }));
    }

    sendMapMoved(fromIdx, toIdx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.MAP_MOVED, { detail: { fromIdx, toIdx } }));
    }

    sendMapSelected(idx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.MAP_SELECTED, { detail: { idx } }));
    }

    sendPlayfieldAdded(id, idx) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.PLAYFIELD_ADDED, { detail: { id, idx } }));
    }

    sendPlayfieldStateChanged(id, registerModes, playfieldMode) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.PLAYFIELD_STATE_CHANGED, { detail: { id, registerModes, playfieldMode } }));
    }

    sendPlayFieldDeleted(id) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.PLAYFIELD_DELETED, { detail: { id } }));
    }

    sendPlayFieldSelected(id) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.PLAYFIELD_SELECTED, { detail: { id } }));
    }

    sendStateLoaded(name, state) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.STATE_LOADED, { detail: { name, state } }));
    }

    sendStateSaved(name, state) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.STATE_SAVED, { detail: { name, state } }));
    }

    sendStateSet(state) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.STATE_SET, { detail: { state } }));
    }
}
