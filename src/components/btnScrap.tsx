import React from "react";
import {Scrap} from "../model/scrap";
import scan = chrome.documentScan.scan;
import "../scss/btnScrap.scss";
import {sendScrapMessage} from "../util/messanger";


export function BtnScrap(scrap: Scrap) {

    const handleClick = () => {
        sendScrapMessage(scrap);
    };

    return (
        <button onClick={handleClick}>
            <span className="button_top">
                {scrap.name}
            </span>
        </button>
    )
}