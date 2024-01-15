console.log("Loaded all.js scrapliz script!")


function getCurrentHostname() : string | null {
    const url = window.location.href;
    try {
        const domain = new URL(url).hostname;
        // Rimuovi "www." se presente
        return domain.replace(/^www\./, '');
    } catch (error) {
        console.error('Errore nell\'estrazione del dominio:', error);
        return null;
    }
}
