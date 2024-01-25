export enum MessageCode {
    BG_CHECK_BY_URL = "BG_CHECK_BY_URL",
    CN_SHOW_CHECK_RESULT = "CN_SHOW_CHECK_RESULT",
    CN_SHOW_NOT_AN_ARTICLE = "CN_SHOW_NOT_AN_ARTICLE"
}

export function sendMessage(messageCode: MessageCode, messagePayload: any) {
    console.log(`sending ${messageCode} with ${messagePayload}`)
    chrome.runtime.sendMessage({
        code: messageCode,
        payload: messagePayload
    })
}