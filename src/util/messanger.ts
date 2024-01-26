import {Scrap} from "../model/scrap";
import {ScriptResponse} from "../model/response";

export function sendScrapMessage(scrap: Scrap, onResponse: (response: ScriptResponse) => void) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // @ts-ignore
        chrome.tabs.sendMessage(tabs[0].id, { action: scrap.id }, function (response) {
            console.log(`Response from content script of scrap "${scrap.id}": ` + response.message);
            onResponse(response);
        });
    });
}