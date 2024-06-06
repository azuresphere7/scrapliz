import {ScriptResponse} from "../model/response";

console.log("Loaded coursera.ts")


function removeTitleSubString(str: string) {
    const substring = "_Coursera";
    const substring2 = " | Coursera";
    if (str.includes(substring)) {
        return str.replace(substring, '');
    }
    if (str.includes(substring2)) {
        return str.replace(substring2, '');
    }
    return str;
}

function getLessonNameFromTitle() {
    console.log("Searching for lesson name...")
    const title = document.title;
    console.log("Found title: " + title)
    return removeTitleSubString(title);
}

function getLessonName() {
    console.log("Searching for lesson name...")
    const elementiH1 = document.querySelectorAll('h1');
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


async function extractAndDwTranscriptionText(tempDiv: HTMLDivElement, lessonName: string ) {
    const phrasesDiv = tempDiv.querySelector('.phrases');
    console.log("Started downloading transcript content...")
    if (phrasesDiv) {
        // Estraiamo il testo dai figli del div con classe "phrases"
        const texts: any[] = [];
        phrasesDiv.childNodes.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                // @ts-ignore
                texts.push(child.innerText.trim());
            }
        });

        // Uniamo tutto il testo in una singola stringa
        const allText = texts.join(" ");

        // Creiamo un Blob con il testo e generiamo un URL per il download
        const blob = new Blob([allText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        // Creiamo un link di download e simuliamo il click per scaricare il file
        const a = document.createElement('a');
        a.href = url;
        a.download = lessonName + ' - '+'transcript.txt';
        document.body.appendChild(a);
        a.click();

        // Rimuoviamo il link dopo il download
        document.body.removeChild(a);

        // Rilasciamo l'URL oggetto
        URL.revokeObjectURL(url);

        console.log("Transcript content downloaded successfully.");
        return {resStatus: true, resData: null, message: "Transcript content downloaded successfully."}
    } else {
        console.error("Could not find transcript div element.");
        return {resStatus: false, resData: null, message: "Could not find transcript div element."}
    }
}


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

function getTabTranscriptionElement() {
    console.log("Searching for tab transcript element...")
    const divIdPrefix = "cds-react-aria-";
    const divs = document.querySelectorAll('[id^="' + divIdPrefix + '"]');
    console.log("Found " + divs.length + " divs with id starting with " + divIdPrefix);
    let targetDiv = null;
    for (let i = 0; i < divs.length; i++) {
        console.log("Found div with id: " + divs[i].id)
        if (divs[i].id.includes("-panel-TRANSCRIPT")) {
            targetDiv = divs[i];
            break;
        }
    }
    return targetDiv;
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
        const linksFounds = linkElements.length;
        console.log("Found " + linksFounds + " links!")
        if(linksFounds != 0) {
            console.log("Found links. Downloading...")
            const lessonName = getLessonNameFromTitle()
            await downloadFiles(linkElements, lessonName);
            return {resStatus: true, resData: null, message: "Downloaded " + linkElements.length + " files!"}
        } else {
            console.error("No links found. The download tab is empty or not opened.")
            return {resStatus: false, resData: null, message: "No links found. Open the download tab."}
        }
    } else {
        console.error("Could not find tab download element.")
        return {resStatus: false, resData: null, message: "Could not find tab download element."}
    }
}


export async function courseraScrapTranscriptionText() {
    const tabTranscriptElement = getTabTranscriptionElement()
    if(tabTranscriptElement) {
        console.log("Tab transcript Found!");
        console.log("Searching for transcript content...")
        const tabTranscriptHtmlContent = tabTranscriptElement.innerHTML;
        // Creiamo un elemento DOM temporaneo per parsare l'HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = tabTranscriptHtmlContent;
        return await extractAndDwTranscriptionText(tempDiv, getLessonNameFromTitle());
    } else {
        console.error("Could not find tab transcript element.")
        return {resStatus: false, resData: null, message: "Could not find tab transcript element."}
    }
}


export async function courseraScrapMdLessonText() {
    const targetDiv = document.querySelector('div[data-testid="cml-viewer"].css-1kgqbsw');
    if (!targetDiv) {
        console.error("Target div not found. Make sure you are on the correct page.");
        return {resStatus: false, resData: null, message: "Could not find lesson text. Make sure you are on the correct page."}
    }

    const childElements = targetDiv.children;
    let markdownContent = '';
    const imagePromises : any[] = [];
    let imageCounter = 0;
    //const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const proxyUrl = 'https://api.allorigins.win/raw?url=';

    function convertToMarkdown(element:any) : any {
        switch (element.tagName.toLowerCase()) {
            case 'h1':
                return `# ${element.textContent}\n\n`;
            case 'h2':
                return `## ${element.textContent}\n\n`;
            case 'h3':
                return `### ${element.textContent}\n\n`;
            case 'h4':
                return `#### ${element.textContent}\n\n`;
            case 'p':
                return `${element.textContent}\n\n`;
            case 'ul':
                // @ts-ignore
                return Array.from(element.children).map(li => `- ${li.textContent}`).join('\n') + '\n\n';
            // Aggiungi altri casi se necessario
            case 'img':
                console.log("Downloading image for current coursera lesson text...")
                imageCounter++;
                const imageUrl = element.src;
                const imageName = `${getLessonNameFromTitle()} - image ${imageCounter}.jpg`;
                //imagePromises.push(downloadImage(proxyUrl + imageUrl, imageName));
                imagePromises.push(downloadImage(proxyUrl + encodeURIComponent(imageUrl), imageName));
                return `![Image ${imageCounter}](./${imageName})\n\n`;
            default:
                console.log("Element not recognized: ", element.outerHTML)
                //return element.outerHTML;  // Fallback per elementi non riconosciuti
                return Array.from(element.childNodes).map(convertToMarkdown).join('');
        }
    }

    async function downloadImage(url: string, name: string) {
        const response = await fetch(url);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
    }

    markdownContent += `# ${getLessonNameFromTitle()}\n\n`;
    for (const el of childElements) {
        markdownContent += convertToMarkdown(el);
    }

    // Aspetta il download di tutte le immagini
    await Promise.all(imagePromises);

    // Crea un blob e scarica il file markdown
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getLessonNameFromTitle() + '.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return {resStatus: true, resData: null, message: "Downloaded lesson text."}
}