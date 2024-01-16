
export function getHostnameFromUrl(url: string | undefined) : string {
    if (url == undefined) {
        return "null";
    }
    try {
        const parsedUrl = new URL(url);
        const temp =  parsedUrl.hostname;
        return temp.replace(/^www\./, '');
    } catch (error) {
        console.error("Errore durante il parsing dell'URL:", error);
        return "null";
    }
}