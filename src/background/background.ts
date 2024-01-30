import { MessageCode, createMessageHandler, sendMessage } from "../content/messages"
import { clearAllStates } from "../content/storage"
import { ApiService } from "./api_service"

const TAG = "BACKGROUND"

const apiService = new ApiService()

// Subscription Init START
chrome.runtime.onInstalled.addListener(details => {
    clearAllStates()
    console.log(TAG, details.reason)
})
chrome.runtime.onConnect.addListener(function (port) {
    if (port.name === "popup") {
        port.onDisconnect.addListener(function () {
        console.log(TAG, "popup has been closed");
    })
  }
})
chrome.runtime.onMessage.addListener(createMessageHandler(messageHandler))

// Subscription Init END

function messageHandler(code: MessageCode, payload: any| null) {
    switch (code) {
        case MessageCode.BG_CHECK_BY_URL:
            performCheck(payload)
            break
        default:
            console.log(TAG, "Unknown code: ", code)
            break
    }
}

function performCheck(url: string) {
    apiService.isArticle(url, function (isArticle: boolean) {
        if (isArticle) {
            apiService.checkByUrl(url, onCheckByUrlSuccess)
        } else {
            sendMessage(MessageCode.CN_SHOW_NOT_AN_ARTICLE)
        }
    })
}

function onCheckByUrlSuccess(resultMessage: string | null) {
    sendMessage(MessageCode.CN_SHOW_CHECK_RESULT, resultMessage)
}