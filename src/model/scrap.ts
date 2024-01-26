import {exampleScrapDesc} from "../script/example";
import {ScriptResponse} from "./response";

export interface Scrap {
    id: string;
    name: string;
    hostname: string;
    description: string;
    exec: () => Promise<ScriptResponse>;
}


export const scrapList: Scrap[] = [
    {
        id: "example_test", name: "Test Scrap", hostname: "example.com", description: "Scrap test", exec: async () => { return exampleScrapDesc(); }
    },
]