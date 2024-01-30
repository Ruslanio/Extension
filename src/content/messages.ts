type Sender = chrome.runtime.MessageSender
type Callback = (message: any, sender: Sender, sendResponse: (response?: any) => void) => void
const TAG = "MESSAGE"

export enum MessageCode {
    BG_CHECK_BY_URL = "BG_CHECK_BY_URL",
    CN_SHOW_CHECK_RESULT = "CN_SHOW_CHECK_RESULT",
    CN_SHOW_NOT_AN_ARTICLE = "CN_SHOW_NOT_AN_ARTICLE"
}

export function sendMessage(code: MessageCode, payload: any = null) {
    console.log(TAG, `sending ${code} with ${payload}`)
    chrome.runtime.sendMessage({ code: code, payload: payload })
}

export function createMessageHandler(handler: (code: MessageCode, payload: any | null) => void): Callback {
    return (request: any, sender: Sender, sendResponse: (response?: any) => void) => {
        if (checkIfMessage(request)) {
            console.log(TAG, "Received message: ", request)
            handler(request.code, request.payload)
        } else {
            console.log(TAG, "Unknown message type: ", request)
        }
    }
}

// Workaround because in God forgotten TypeScript instanceof work once in a decade
function checkIfMessage(request: any): boolean {
    return request.code && (request.payload || request.payload == null)
}
