import { Message, MessageCode, createMessageHandler, sendMessage } from "../content/messages"
import { ApiService } from "./api_service"

const TAG = "BACKGROUND"

const apiService = new ApiService()

// Subscription Init
chrome.runtime.onInstalled.addListener(details => {
    console.log(details.reason)
})
chrome.runtime.onMessage.addListener(createMessageHandler(messageHandler))


function messageHandler(message: Message) {
    switch (message.code) {
        case MessageCode.BG_CHECK_BY_URL:
            performCheck(message.payload)
            break
        default:
            console.log(TAG, "Unknown code: ", message.code)
            break
    }
}

function performCheck(url: string) {
    apiService.isArticle(url, function (isArticle: boolean) {
        if (isArticle) {
            apiService.checkByUrl(url, onCheckByUrlSuccess)
        } else {
            sendMessage({ code: MessageCode.CN_SHOW_NOT_AN_ARTICLE, payload: null })
        }
    })
}

function onCheckByUrlSuccess(resultMessage: string | null) {
    sendMessage({ code: MessageCode.CN_SHOW_CHECK_RESULT, payload: resultMessage })
}