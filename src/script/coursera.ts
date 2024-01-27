import {ScriptResponse} from "../model/response";

console.log("Loaded coursera.ts")


async function downloadFile(url: string, filename: string) {
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



async function downloadFiles(links: NodeListOf<HTMLAnchorElement>, lessonName: string) {
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


function getTabDownloadElement() {
    console.log("Searching for tab download element...")
    const divIdPrefix = "cds-react-aria-";
    const divs = document.querySelectorAll('[id^="' + divIdPrefix + '"]');
    console.log("Found " + divs.length + " divs with id starting with " + divIdPrefix);
    let targetDiv = null;
    for (let i = 0; i < divs.length; i++) {
        console.log("Found div with id: " + divs[i].id)
        if (divs[i].id.includes("-panel-DOWNLOADS")) {
            targetDiv = divs[i];
            break;
        }
    }
    return targetDiv;
}

function getLessonName() {
    const elementiH1 = document.querySelectorAll('h1.cds-108.video-name.css-bbd009.cds-110');
    if (elementiH1.length > 0) {
        // @ts-ignore
        console.log("Found lesson name: " + elementiH1[0].textContent || elementiH1[0].innerText);
        // @ts-ignore
        return elementiH1[0].textContent || elementiH1[0].innerText;
    } else {
        console.error("Could not find lesson name.")
        return "lesson"
    }
}

export async function courseraScrapLessonFiles(): Promise<ScriptResponse> {
    const tabDownloadElement = getTabDownloadElement()
    if(tabDownloadElement) {
        console.log("Tab download Found!");
        console.log("Searching for downloadable content files...")
        const tabDownloadHtmlContent = tabDownloadElement.innerHTML;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = tabDownloadHtmlContent;
        const linkElements = tempDiv.querySelectorAll('a');
        console.log("Found " + linkElements.length + " links!")
        const lessonName = getLessonName()
        await downloadFiles(linkElements, lessonName);
        return {resStatus: true, resData: null, message: "Downloaded " + linkElements.length + " files!"}
    } else {
        console.error("Could not find tab download element.")
        return {resStatus: false, resData: null, message: "Could not find tab download element."}
    }
}