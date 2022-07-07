import { COMMANDS } from './custom_event_handler.js';

export class StorageHandler {
    #eventHandler;

    #getStateKey(stateName) {
        return 'state__' + stateName;
    }

    constructor(eventHandler) {
        this.#eventHandler = eventHandler;

        this.#eventHandler.addEventListener(COMMANDS.LOAD_STATE, (e) => {
            const stateName = e.detail.name;
            const stateKey = this.#getStateKey(stateName);
            const state = localStorage.getItem(stateKey);

            this.#eventHandler.sendStateLoaded(stateName, state);

            this.#eventHandler.sendSetState(state);
        });

        this.#eventHandler.addEventListener(COMMANDS.SAVE_STATE, (e) => {
            const stateName = e.detail.name;
            const stateKey = this.#getStateKey(stateName);
            const state = e.detail.state;
            localStorage.setItem(stateKey, state);

            this.#eventHandler.sendStateSaved(stateName, state);
        });
    }
}
