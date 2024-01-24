console.log("Loaded background script!")

/*
chrome.tabs.onActivated.addListener(function (activeInfo) {
   updateBadge(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
   if (changeInfo.status === 'complete') {
      updateBadge(tabId);
   }
});

function updateBadge(tabId : any) {
   console.log("Updating scrapliz badge for tab " + tabId)
   chrome.tabs.get(tabId, function (tab) {
      // @ts-ignore
      if (tab.url.includes("esempio.com")) { // Sostituisci "esempio.com" con il sito desiderato
         chrome.browserAction.setBadgeText({ text: "3", tabId: tabId });
      } else {
         chrome.browserAction.setBadgeText({ text: "2", tabId: tabId });
      }
   });
}
*/