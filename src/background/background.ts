import { ChatCompletion } from "openai/resources"
import { MessageCode, createMessageHandler, sendMessage } from "../content/messages"
import { clearAllStates } from "../content/storage"
import { ApiService } from "./api_service"
import { FinishReason } from "./models/choice_finish_reason"
import OpenAI from "openai"

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

function messageHandler(code: MessageCode, payload: any | null) {
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
    apiService.isArticle(url)
        .then((completion: ChatCompletion) => {
            handleChatCompletion(
                completion,
                handleIsArticleSuccess.bind(null, url, completion),
                sendMessage.bind(null, MessageCode.CN_ERR_NOT_AN_ARTICLE),
                sendMessage.bind(null, MessageCode.CN_ERR_MODERATION_FAILED)
            )
        })
        .catch(onError)
}


/**
 * Handles the success response of checking if an article is valid.
 * 
 * @param url - The URL of the article.
 * @param isArticleCompletion - The completion object containing the choices for the article.
 */
function handleIsArticleSuccess(url: string, isArticleCompletion: ChatCompletion) {
    if (mapToBool(isArticleCompletion.choices[0].message.content)) {
        checkByUrl(url)
    } else {
        sendMessage(MessageCode.CN_ERR_NOT_AN_ARTICLE)
    }
}

function checkByUrl(url: string) {
    apiService.checkByUrl(url)
        .then(onCheckByUrlSuccess)
        .catch(onError)
}

function onCheckByUrlSuccess(completion: ChatCompletion) {
    handleChatCompletion(
        completion,
        sendMessage.bind(null, MessageCode.CN_SHOW_CHECK_RESULT, completion.choices[0].message.content),
        sendMessage.bind(null, MessageCode.CN_ERR_TOO_LONG),
        sendMessage.bind(null, MessageCode.CN_ERR_MODERATION_FAILED)
    )
}

function handleChatCompletion(
    completion: ChatCompletion,
    onStop: (message: string) => void,
    onLengthExceeded: (message: string) => void,
    onFilteredOut: (message: string) => void
) {
    var resultMessage = completion.choices[0].message.content
    console.log(TAG, "handleChatCompletion", completion)
    switch (completion.choices[0].finish_reason) {
        case FinishReason.STOP:
            onStop(resultMessage!)
            break
        case FinishReason.LENGTH:
            onLengthExceeded(resultMessage!)
            break
        case FinishReason.CONTENT_FILTER:
            onFilteredOut(resultMessage!)
            break
        case FinishReason.TOOL_CALLS:
            // TODO: Implement tool calls
            break
        case FinishReason.FUNCTION_CALL:
            // TODO: Implement function calls
            break
        default:
            break
    }
}

function onError(error: any) {
    if (error instanceof OpenAI.RateLimitError) {
        sendMessage(MessageCode.CN_ERR_LIMIT_EXCEEDED)
    } else if (error instanceof OpenAI.APIConnectionTimeoutError) {
        sendMessage(MessageCode.CN_ERR_TIMEOUT)
    }
    console.log(TAG, "onError", error)
}

function mapToBool(response: string | null): boolean {
    return response?.toLowerCase() === "Yes".toLowerCase()
}