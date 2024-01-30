import { State } from "./states";

const TAG = "STORAGE"

type Entries = { [key: string]: any }

export function clearAllStates() {
    chrome.storage.local.clear()
}

export class StateHandler<S extends State> {
    private stateKey: string;

    constructor(stateKey: string) {
        this.stateKey = stateKey
    }

    saveState(state: S, onSaved: (() => void) = () => {}) {
        console.log(TAG, "saveState", `saving state with key: ${this.stateKey} an value: `, state)
        chrome.storage.local.set({ [this.stateKey]: state }, onSaved)
    }

    getState(onComplete: (state: S | null) => void) {
        chrome.storage.local.get([this.stateKey], (result: Entries) => {
            var state = result[this.stateKey]
            console.log(TAG, "getState", `state with key: ${this.stateKey} retrieved with value: `, state)
            onComplete(state)
        })
    }
}

