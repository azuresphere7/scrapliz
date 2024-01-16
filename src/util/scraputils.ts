import {Scrap, scrapList} from "../model/scrap";

export function getScrapsFromHostname(hostname: string): Scrap[] {
    return scrapList.filter(scrap => scrap.hostname == hostname);
}