import {Scrap} from "../model/scrap";

export function sendScrapMessage(scrap: Scrap) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // @ts-ignore
        chrome.tabs.sendMessage(tabs[0].id, { action: scrap.id }, function (response) {
            console.log(`Response from content script of scrap "${scrap.id}": ` + response.message);
        });
    });
}