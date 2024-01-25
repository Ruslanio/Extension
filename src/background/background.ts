import { MessageCode, sendMessage } from "../content/messages"
import { ApiService } from "./api_service"

type Sender = chrome.runtime.MessageSender

const apiService = new ApiService()

chrome.runtime.onInstalled.addListener(details => {
    console.log(details.reason)  
})

chrome.runtime.onMessage.addListener(messageHandler)

function messageHandler(request: any, sender: Sender, sendResponse: (response: any) => void) {
    console.log(`BG: message: ${request.code}`)
    switch(request.code) {
        case MessageCode.BG_CHECK_BY_URL:
            performCheck(request.payload)
            break
        case null:
            console.log("Null message")
            break
    }
}

function performCheck(url: string) {
    apiService.isArticle(url, function(isArticle: boolean) {
        if(isArticle) {
            apiService.checkByUrl(url, onCheckByUrlSuccess)
        } else {
            sendMessage(MessageCode.CN_SHOW_NOT_AN_ARTICLE, null)
        }
    })
}

function onCheckByUrlSuccess(resultMessage: string| null) {
    sendMessage(MessageCode.CN_SHOW_CHECK_RESULT, resultMessage)
}