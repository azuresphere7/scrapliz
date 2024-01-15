"use strict";
function execScrapeLearnn() {
    console.log("Sending message to content script to scrape learnn...");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // @ts-ignore
        chrome.tabs.sendMessage(tabs[0].id, { action: 'scrape_learnn' }, function (response) {
            console.log("Response from content script: " + response.message);
        });
    });
}
function execScrapeCoursera() {
    console.log("Sending message to content script to scrape coursera...");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // @ts-ignore
        chrome.tabs.sendMessage(tabs[0].id, { action: 'scrape_coursera' }, function (response) {
            console.log("Response from content script: " + response.message);
        });
    });
}
// @ts-ignore
document.getElementById("btnScrapeLearnn").addEventListener("click", execScrapeLearnn);
// @ts-ignore
document.getElementById("btnScrapeCoursera").addEventListener("click", execScrapeCoursera);
function getCurrentHostname() {
    const url = window.location.href;
    try {
        const domain = new URL(url).hostname;
        // Rimuovi "www." se presente
        return domain.replace(/^www\./, '');
    }
    catch (error) {
        console.error('Errore nell\'estrazione del dominio:', error);
        return null;
    }
}
function init() {
    console.log("Loaded popup.js script!");
    console.log("Current hostname: " + getCurrentHostname());
}
init();
