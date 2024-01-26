import {exampleScrapDesc} from "../script/example";

export interface Scrap {
    id: string;
    name: string;
    hostname: string;
    description: string;
    exec: () => Promise<void>;
}


export const scrapList: Scrap[] = [
    {
        id: "example_scrape_title",
        name: "Get desc",
        hostname: "example.com",
        description: "Desc text scrap from example.com",
        exec: async () => { return await exampleScrapDesc() }
    },
]