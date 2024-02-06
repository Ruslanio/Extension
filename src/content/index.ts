import { MessageCode, createMessageHandler, sendMessage } from "./messages";
import { MainScreenState } from "./states";
import { StateHandler } from "./storage";
import { GPT_TIMEOUT, MODERATION_FAILED, NOT_AN_ARTICLE, RATE_LIMIT_EXCEEDED, TOO_LONG } from "./strings";

const TAG = "CONTENT INDEX"
const STATE_KEY_MAIN = "STATE_KEY_MAIN"

var state: MainScreenState = new MainScreenState()
const stateHandler = new StateHandler<MainScreenState>(STATE_KEY_MAIN)

// Subscriptions init START
chrome.runtime.onMessage.addListener(createMessageHandler(messageHandler))
chrome.runtime.connect({ name: "popup" })

document.addEventListener('DOMContentLoaded', function () {
    console.log(TAG, "DOM loaded")

    restoreState()
    initViews()
})

// Subscriptions init END

function restoreState() {
    stateHandler.getState((prevState) => {
        if (prevState != null) {
            Object.assign(state, prevState)

            console.log(TAG, "restoreState", "state restored to ", prevState)
            console.log(TAG, "restoreState", "new steate ", state)
        } else {
            console.log(TAG, "restoreState", "no previously saved state")
        }
        render(state)
    })
}

function messageHandler(code: MessageCode, payload: any | null) {
    switch (code) {
        case MessageCode.CN_SHOW_CHECK_RESULT:
            setSummary(payload)
            break
        case MessageCode.CN_ERR_NOT_AN_ARTICLE:
            setError(NOT_AN_ARTICLE)
            break
        case MessageCode.CN_ERR_TOO_LONG:
            setError(TOO_LONG)
            break
        case MessageCode.CN_ERR_MODERATION_FAILED:
            setError(MODERATION_FAILED)
            break
        case MessageCode.CN_ERR_LIMIT_EXCEEDED:
            setError(RATE_LIMIT_EXCEEDED)
            break
        case MessageCode.CN_ERR_TIMEOUT:
            setError(GPT_TIMEOUT)
        default:
            console.log(TAG, "Unknown code: ", code)
            break
    }
}

// UI control START

var btnCheck: HTMLButtonElement
var progress: HTMLElement
var txtCheckResult: HTMLElement

function initViews() {
    btnCheck = document.getElementById("btn-check") as HTMLButtonElement
    progress = document.getElementById("progress")!
    txtCheckResult = document.getElementById("txt_check_result")!

    btnCheck?.addEventListener('click', onCheckClicked)
}

function render(state: MainScreenState) {
    if (state.isLoading) {
        showLoading()
    } else if (state.isNotAnArticle) {
        showNotAnArticle(state.errorMessage!)
    } else if (state.summary != null) {
        showCheckResult(state.summary)
    }
}

function onCheckClicked() {
    setLoading()

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        if (currentTab) {
            sendMessage(MessageCode.BG_CHECK_BY_URL, currentTab.url)
        }
    });
}

function setLoading() {
    state.updateLoading()
    updateState()
    showLoading()
}

function setError(message: string) {
    state.updateNotAnArticle(message)
    updateState()
    showNotAnArticle(message)
}

function setSummary(summary: string) {
    state.updateSummary(summary)
    updateState()
    showCheckResult(summary)
}

function showLoading() {
    showProgress()
    setResultText("")
}

function showCheckResult(resultMessage: string) {
    hideProgress()
    setResultText(resultMessage)
}

function showNotAnArticle(message: string) {
    hideProgress()
    setResultText(message)

}

function setResultText(resultMessage: string) {
    if (txtCheckResult && resultMessage) txtCheckResult.innerText = resultMessage
}

function hideProgress() {
    if (progress && btnCheck) {
        progress.style.display = "none"
        btnCheck.style.display = "block"
    }
}

function showProgress() {
    if (progress && btnCheck) {
        progress.style.display = "block"
        btnCheck.style.display = "none"
    }
}

function updateState() {
    stateHandler.saveState(state)
}
// UI control END