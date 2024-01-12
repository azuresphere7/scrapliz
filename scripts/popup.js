console.log("Loaded popup.js script!")


function execScrapeLearnn() {
    console.log("Sending message to content script to scrape learnn...")
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'scrape_learnn' }, function(response) {
            console.log("Response from content script: " + response.message);
        });
    });
}


document.getElementById("btnScrapeLearnn").addEventListener("click", execScrapeLearnn);
