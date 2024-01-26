import {scrapList} from "./model/scrap";
import {ScriptResponse} from "./model/response";

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    let scrapId = request.action;
    let scrapFound = false;
    for (const scrap of scrapList) {
        if (scrapId === scrap.id) {
            console.log('Content script will execute: ', scrap.id);
            scrapFound = true;
            let response : ScriptResponse = await scrap.exec()
            sendResponse(response);
        }
    }
    if(!scrapFound) {
        sendResponse({ message: `Script not found. ID "${scrapId}" is unknown!`, resData: {}, resStatus: false});
    }
    return true
})
