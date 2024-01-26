import {scrapList} from "./model/scrap";
import {ScriptResponse} from "./model/response";

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    let scrapId = request.action;
    let scrapFound = false;
    try {
        for (const scrap of scrapList) {
            if (scrapId === scrap.id) {
                console.log('Content script will execute: ', scrap.id);
                scrapFound = true;
                await scrap.exec()
                let response : ScriptResponse = { message: "ok", resData: {}, resStatus: true};
                sendResponse(response);
            }
        }
        if(!scrapFound) {
            sendResponse({ message: "Scrap not found", resData: {}, resStatus: false});
        }
        return true
    } catch (e) {
        console.log(`Error while executing ${scrapId}: `, e);
        return true
    }
})
