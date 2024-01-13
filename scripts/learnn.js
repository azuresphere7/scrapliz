console.log("Loaded learnn.js script!")


async function scrape() {

    const transcriptionTab = document.getElementsByClassName("transcriptionTab_transcriptText__zoErO");
    const titleTab = document.getElementsByClassName("playerSideContent_title__tpgxr");
    const title = titleTab[0].textContent || titleTab[0].innerText;
    console.log("Scraping transcription for video: " + title)


    if(transcriptionTab.length > 0) {
        console.log("Found transcription tab!")
        var contentElement = transcriptionTab[0];
        var tags = contentElement.querySelectorAll('*');
        // Crea una stringa per contenere il testo
        var textToSave = '';

        // Cicla attraverso i tag e aggiungi il loro contenuto alla stringa
        tags.forEach(function(tag) {
            if (tag.tagName.toLowerCase() === 'br') {
                textToSave += '\n';
            } else if (tag.tagName.toLowerCase() === 'span') {
                textToSave += " "
                textToSave += tag.textContent || tag.innerText;
            }
            //console.log(tag.textContent || tag.innerText);
        });

        // Crea un oggetto Blob contenente il testo
        const blob = new Blob([textToSave], { type: 'text/plain' });

        // Crea un link temporaneo per il download
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);

        // Chiedi all'utente dove vuole salvare il file
        link.download = `${title}.txt`

        // Aggiungi il link all'elemento body e simula il click
        document.body.appendChild(link);
        link.click();

        // Rimuovi il link dopo il download
        document.body.removeChild(link);
    } else {
        console.error("Could not find transcription tab!")
    }
}


function downloadVideo() {
    var videoElement = document.getElementById('myVideo');
    var videoUrl = videoElement.src;
    var videoBlob = fetch(videoUrl).then(response => response.blob());

    videoBlob.then(function (blob) {
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = 'video_download.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}


chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === 'scrape_learnn') {
        console.log("Received message to scrape learnn!")
        await scrape()
        sendResponse({message: "ok"});
    }
});

