import React from "react";
import {Scrap} from "../model/scrap";
import scan = chrome.documentScan.scan;
import "../scss/btnScrap.scss";


export function BtnScrap(scrap: Scrap) {
    return (
        <button>
            <span className="button_top">
                {scrap.name}
            </span>
        </button>
    )
}