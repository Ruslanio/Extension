import { Message, MessageCode, createMessageHandler, sendMessage } from "./messages";
const TAG = "CONTENT INDEX"

console.log(TAG, "index init")

// Subscriptions init
chrome.runtime.onMessage.addListener(createMessageHandler(messageHandler))


function onCheckClicked() {
    showProgress()
    setResultText("")

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log("inside query")
        var currentTab = tabs[0];
        if (currentTab) {
            sendMessage({ code: MessageCode.BG_CHECK_BY_URL, payload: currentTab.url })
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM loaded")
    document.getElementById("btn-check")?.addEventListener('click', onCheckClicked)
})

function messageHandler(message: Message) {
    switch (message.code) {
        case MessageCode.CN_SHOW_CHECK_RESULT:
            showCheckResult(message.payload)
            break
        case MessageCode.CN_SHOW_NOT_AN_ARTICLE:
            showNotAnArticle()
            break
        default:
            console.log(TAG, "Unknown code: ", message.code)
            break
    }
}

function showCheckResult(resultMessage?: string) {
    hideProgress()
    setResultText(resultMessage)
}

function showNotAnArticle() {
    hideProgress()
    setResultText("This is not even an article, dolbaeb")
}

function setResultText(resultMessage?: string) {
    var text = document.getElementById("txt_check_result")
    if (text && resultMessage) text.innerText = resultMessage
}

function hideProgress() {
    var button = document.getElementById("btn-check")
    var progress = document.getElementById("progress")
    if (progress && button) {
        progress.style.display = "none"
        button.style.display = "block"
    }
}

function showProgress() {
    var button = document.getElementById("btn-check")
    var progress = document.getElementById("progress")
    if (progress && button) {
        progress.style.display = "block"
        button.style.display = "none"
    }
}