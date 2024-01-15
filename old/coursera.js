console.log("Loaded coursera.js script!")


async function downloadFile(url, filename) {
    try {
        // Effettua una richiesta per ottenere il file come Blob
        const response = await fetch(url);
        const fileBlob = await response.blob();

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
    } catch (error) {
        console.error('Errore durante il download:', error);
    }
}

async function downloadFiles(links, lessonName) {
    console.log("Downloading " + links.length + " files...")
    for (const link of links) {
        const trackComponentValue = link.dataset.trackComponent;
        const url = link.href;
        console.log("Checking link: " + url)
        if (trackComponentValue !== undefined) {
            console.log("data-track-component = " + trackComponentValue);
            if(trackComponentValue === "download_video") {
                console.log("Current link is a video. Downloading...")
                await downloadFile(url, `${lessonName}.mp4`);
            } else {
                console.log("Current link is not a video. Download text...")
                await downloadFile(url, `${lessonName}.txt`);
            }
        } else {
            console.log("data-track-component non esiste");
        }
    }
}

function getLessonName() {
    var elementiH1 = document.querySelectorAll('h1.cds-108.video-name.css-bbd009.cds-110');
    if (elementiH1.length > 0) {
        console.log("Found lesson name: " + elementiH1[0].textContent || elementiH1[0].innerText);
        return elementiH1[0].textContent || elementiH1[0].innerText;
    } else {
        return "lesson"
    }
}

function getTabDownloadElement() {
    var divIdPrefix = "cds-react-aria-";
    var divs = document.querySelectorAll('[id^="' + divIdPrefix + '"]');
    console.log("Found " + divs.length + " divs with id starting with " + divIdPrefix);
// Cerca il div specifico tra quelli trovati
    var targetDiv = null;
    for (var i = 0; i < divs.length; i++) {
        console.log("Found div with id: " + divs[i].id)
        if (divs[i].id.includes("-panel-DOWNLOADS")) {
            targetDiv = divs[i];
            break;
        }
    }
    return targetDiv;
}

async function scrapeCoursera() {
    const tabDownloadElement = getTabDownloadElement()
    if (tabDownloadElement) {
        console.log("Tab download Found!");
        const tabDownloadHtmlContent = tabDownloadElement.innerHTML;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = tabDownloadHtmlContent;
        const linkElements = tempDiv.querySelectorAll('a');
        console.log("Found " + linkElements.length + " links!")
        const lessonName = getLessonName()
        await downloadFiles(linkElements, lessonName);
    } else {
        console.log("L'elemento tab download non esiste.");
    }

}


chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === 'scrape_coursera') {
        console.log("Received message to scrape Coursera!")
        await scrapeCoursera()
        sendResponse({message: "ok"});
    }
});
