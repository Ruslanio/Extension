import fecthForRandomJoke from "./api_service"

chrome.runtime.onInstalled.addListener(details => {
    console.log(details.reason)
    fecthForRandomJoke()
})