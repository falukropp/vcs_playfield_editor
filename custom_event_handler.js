export const EVENTS = {
    EDITOR_STATE_CHANGED: 'EDITOR_STATE_CHANGED',
    EDITOR_CONTENT_CHANGED: 'EDITOR_CONTENT_CHANGED',
};
// Add / Edit / Remove / Select playfield?
// Add / Remove map?

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

    sendEditorStateChanged(registerModes, playfieldMode, drawMode) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.EDITOR_STATE_CHANGED, { detail: { registerModes, playfieldMode, drawMode } }));
    }

    sendEditorDataChanged(data) {
        this.#eventTarget.dispatchEvent(new CustomEvent(EVENTS.EDITOR_CONTENT_CHANGED, { detail: {data} }));
    }
}
