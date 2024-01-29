type Sender = chrome.runtime.MessageSender
type Callback = (message: any, sender: Sender, sendResponse: (response?: any) => void) => void
const TAG = "MESSAGE"

export class Message {
    code!: MessageCode;
    payload: any
}

export enum MessageCode {
    BG_CHECK_BY_URL = "BG_CHECK_BY_URL",
    CN_SHOW_CHECK_RESULT = "CN_SHOW_CHECK_RESULT",
    CN_SHOW_NOT_AN_ARTICLE = "CN_SHOW_NOT_AN_ARTICLE"
}

export function sendMessage(message: Message) {
    console.log(TAG, `sending ${message.code} with ${message.payload}`)
    chrome.runtime.sendMessage(message)
}

export function createMessageHandler(handler: (message: Message) => void) : Callback {
     return (request: any, sender: Sender, sendResponse: (response?: any) => void) => {
        if (request instanceof Message) {
            console.log(TAG, "Received message: ", request)
            handler(request)
        } else {
            console.log(TAG, "Unknown message type: ", request)
        }
     }
}
