import React from "react";
import {Scrap} from "../model/scrap";
import "../scss/btnScrap.scss";


export interface BtnScrapProps {
    scrap: Scrap;
    operationActive: boolean;
    onClick: () => void;
}


export function BtnScrap({ scrap, operationActive, onClick }: BtnScrapProps) {

    return (
        <button onClick={onClick} disabled={operationActive}>
            {operationActive ? <span className="spinner">active</span> : <span className="button_top">{scrap.name}</span>}
        </button>
    )
}