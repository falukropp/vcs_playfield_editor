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
            const stateRaw = localStorage.getItem(stateKey);

            if (stateRaw) {                
                const state = JSON.parse(stateRaw);
                this.#eventHandler.sendStateLoaded(stateName, state);
                this.#eventHandler.sendSetState(state);
            } else {
                console.log(`state : ${stateName} not found`);
            }
        });

        this.#eventHandler.addEventListener(COMMANDS.SAVE_STATE, (e) => {
            const stateName = e.detail.name;
            const stateKey = this.#getStateKey(stateName);
            const state = e.detail.state;

            if (state) {
                localStorage.setItem(stateKey, JSON.stringify(state));
                this.#eventHandler.sendStateSaved(stateName, state);
            }
        });
    }
}
