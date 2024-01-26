import {Scrap} from "../model/scrap";
import React from "react";
import {SnackbarType} from "../model/snackbarType";
import {SnackbarState} from "../model/snackbarState";
import "../scss/snackbar.scss";


export const Snackbar = (state: SnackbarState) => {
    let color : string

    switch (state.type) {
        case SnackbarType.SUCCESS:
            color = "#10c017"
            break;
        case SnackbarType.ERROR:
            color = "#c01010"
            break;
        case SnackbarType.INFO:
            color = "#107fc0"
            break;
        case SnackbarType.WARNING:
            color = "#ae8f05"
            break;
        default:
            color = "#107fc0"
            break;
    }


    return (
        <div className={"snackDiv"} style={{display: state.isOpen ? 'block' : 'none', backgroundColor: color}}>
            <div className="snackTitle">{state.text}</div>
        </div>
    )
}