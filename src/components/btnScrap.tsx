import React from "react";
import {Scrap} from "../model/scrap";
import scan = chrome.documentScan.scan;
import "../scss/btnScrap.scss";
import {sendScrapMessage} from "../util/messanger";


export interface BtnScrapProps {
    scrap: Scrap;
    onClick: () => void;
}


export function BtnScrap({ scrap, onClick }: BtnScrapProps) {

    return (
        <button onClick={onClick}>
            <span className="button_top">
                {scrap.name}
            </span>
        </button>
    )
}