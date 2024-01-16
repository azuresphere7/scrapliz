
export interface Scrap {
    id: string;
    name: string;
    hostname: string;
    description: string;
}


export const scrapList: Scrap[] = [
    { id: "example_scrape_title", name: "Get title", hostname: "example.com", description: "Title text scrap from example.com" },
]