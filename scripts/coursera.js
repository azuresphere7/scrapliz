"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log("Loaded coursera.js scrapliz script!");
function downloadFile(url, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Effettua una richiesta per ottenere il file come Blob
            const response = yield fetch(url);
            const fileBlob = yield response.blob();
            // Crea un oggetto URL temporaneo per il file
            const fileURL = URL.createObjectURL(fileBlob);
            // Crea un elemento a per il download
            const downloadLink = document.createElement('a');
            downloadLink.href = fileURL;
            downloadLink.download = filename;
            // Aggiungi il link al documento e simula un clic
            document.body.appendChild(downloadLink);
            downloadLink.click();
            // Rimuovi il link e l'URL temporaneo
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(fileURL);
            console.log('Download completato.');
        }
        catch (error) {
            console.error('Errore durante il download:', error);
        }
    });
}
function downloadFiles(links, lessonName) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Downloading " + links.length + " files...");
        for (const link of links) {
            const trackComponentValue = link.dataset.trackComponent;
            const url = link.href;
            console.log("Checking link: " + url);
            if (trackComponentValue !== undefined) {
                console.log("data-track-component = " + trackComponentValue);
                if (trackComponentValue === "download_video") {
                    console.log("Current link is a video. Downloading...");
                    yield downloadFile(url, `${lessonName}.mp4`);
                }
                else {
                    console.log("Current link is not a video. Download text...");
                    yield downloadFile(url, `${lessonName}.txt`);
                }
            }
            else {
                console.log("data-track-component non esiste");
            }
        }
    });
}
function getLessonName() {
    const elementiH1 = document.querySelectorAll('h1.cds-108.video-name.css-bbd009.cds-110');
    if (elementiH1.length > 0) {
        // @ts-ignore
        console.log("Found lesson name: " + elementiH1[0].textContent || elementiH1[0].innerText);
        // @ts-ignore
        return elementiH1[0].textContent || elementiH1[0].innerText;
    }
    else {
        return "lesson";
    }
}
function getTabDownloadElement() {
    var divIdPrefix = "cds-react-aria-";
    var divs = document.querySelectorAll('[id^="' + divIdPrefix + '"]');
    console.log("Found " + divs.length + " divs with id starting with " + divIdPrefix);
    // Cerca il div specifico tra quelli trovati
    var targetDiv = null;
    for (var i = 0; i < divs.length; i++) {
        console.log("Found div with id: " + divs[i].id);
        if (divs[i].id.includes("-panel-DOWNLOADS")) {
            targetDiv = divs[i];
            break;
        }
    }
    return targetDiv;
}
function scrapeCoursera() {
    return __awaiter(this, void 0, void 0, function* () {
        const tabDownloadElement = getTabDownloadElement();
        if (tabDownloadElement) {
            console.log("Tab download Found!");
            const tabDownloadHtmlContent = tabDownloadElement.innerHTML;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = tabDownloadHtmlContent;
            const linkElements = tempDiv.querySelectorAll('a');
            console.log("Found " + linkElements.length + " links!");
            const lessonName = getLessonName();
            yield downloadFiles(linkElements, lessonName);
        }
        else {
            console.log("L'elemento tab download non esiste.");
        }
    });
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        if (request.action === 'scrape_coursera') {
            console.log("Received message to scrape Coursera!");
            yield scrapeCoursera();
            sendResponse({ message: "ok" });
        }
    });
});
