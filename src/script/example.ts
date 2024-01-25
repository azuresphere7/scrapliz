console.log("Loaded example.ts")

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'scrape_learnn') {
        console.log("Received message to scrape learnn!");
        sendResponse({ message: "ok" });
    }
});
