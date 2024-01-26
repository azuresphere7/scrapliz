export interface UserSettings {
    enableCopyright: boolean;
    scrapPath: string;
}

export function getDefaultUserSettings(): UserSettings {
    return {
        enableCopyright: true,
        scrapPath: "scrap",
    }
}