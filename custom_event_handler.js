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
    PLAYFIELD_DATA_CHANGED: 'PLAYFIELD_DATA_CHANGED',
    PLAYFIELD_STATE_CHANGED: 'PLAYFIELD_STATE_CHANGED',
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

    #dispatchCustomEvent(event, detail) {
        this.#eventTarget.dispatchEvent(new CustomEvent(event, { detail }));
    }

    // -----------------------------------------------------------------------
    // Helpers for commands
    // -----------------------------------------------------------------------

    sendAddPlayField(id) {
        this.#dispatchCustomEvent(COMMANDS.ADD_PLAYFIELD, { id });
    }

    sendAddToMap(id, idx) {
        this.#dispatchCustomEvent(COMMANDS.ADD_TO_MAP, { id, idx });
    }

    sendChangePlayfieldData(id, data) {
        this.#dispatchCustomEvent(COMMANDS.CHANGE_PLAYFIELD_DATA, { id, data });
    }

    sendChangePlayfieldState(id, registerModes, playfieldMode) {
        this.#dispatchCustomEvent(COMMANDS.CHANGE_PLAYFIELD_STATE, { id, registerModes, playfieldMode });
    }

    sendDeletePlayField(id) {
        this.#dispatchCustomEvent(COMMANDS.DELETE_PLAYFIELD, { id });
    }

    sendDeleteFromMap(idx) {
        this.#dispatchCustomEvent(COMMANDS.DELETE_FROM_MAP, { idx });
    }

    sendLoadState(name) {
        this.#dispatchCustomEvent(COMMANDS.LOAD_STATE, { name });
    }

    sendMoveMap(fromIdx, toIdx) {
        this.#dispatchCustomEvent(COMMANDS.MOVE_MAP, { fromIdx, toIdx });
    }

    sendSaveState(name, state) {
        this.#dispatchCustomEvent(COMMANDS.SAVE_STATE, { name, state });
    }

    sendSetState(state) {
        this.#dispatchCustomEvent(COMMANDS.SET_STATE, { state });
    }

    sendSelectMap(idx) {
        this.#dispatchCustomEvent(COMMANDS.SELECT_MAP, { idx });
    }

    sendSelectPlayField(id) {
        this.#dispatchCustomEvent(COMMANDS.SELECT_PLAYFIELD, { id });
    }

    // -----------------------------------------------------------------------
    // Helpers for events
    // -----------------------------------------------------------------------


    sendMapAdded(id, idx) {
        this.#dispatchCustomEvent(EVENTS.MAP_ADDED, { id, idx });
    }

    sendMapDeleted(idx) {
        this.#dispatchCustomEvent(EVENTS.MAP_DELETED, { idx });
    }

    sendMapMoved(fromIdx, toIdx) {
        this.#dispatchCustomEvent(EVENTS.MAP_MOVED, { fromIdx, toIdx });
    }

    sendMapSelected(idx) {
        this.#dispatchCustomEvent(EVENTS.MAP_SELECTED, { idx });
    }

    sendPlayfieldAdded(id, idx) {
        this.#dispatchCustomEvent(EVENTS.PLAYFIELD_ADDED, { id, idx });
    }

    sendPlayfieldDataChanged(id, data) {
        this.#dispatchCustomEvent(EVENTS.PLAYFIELD_DATA_CHANGED, { id, data });
    }

    sendPlayfieldStateChanged(id, registerModes, playfieldMode) {
        this.#dispatchCustomEvent(EVENTS.PLAYFIELD_STATE_CHANGED, { id, registerModes, playfieldMode });
    }

    sendPlayFieldDeleted(id) {
        this.#dispatchCustomEvent(EVENTS.PLAYFIELD_DELETED, { id });
    }

    sendPlayFieldSelected(id) {
        this.#dispatchCustomEvent(EVENTS.PLAYFIELD_SELECTED, { id });
    }

    sendStateLoaded(name, state) {
        this.#dispatchCustomEvent(EVENTS.STATE_LOADED, { name, state });
    }

    sendStateSaved(name, state) {
        this.#dispatchCustomEvent(EVENTS.STATE_SAVED, { name, state });
    }

    sendStateSet(state) {
        this.#dispatchCustomEvent(EVENTS.STATE_SET, { state } );
    }
}
