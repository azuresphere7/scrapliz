import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { loggiz } from "./utils";
import "./scss/popup.scss";
import "./scss/typeography.scss";
import {getHostnameFromUrl} from "./util/urlutils";
import {Scrap} from "./model/scrap";
import {getScrapsFromHostname} from "./util/scraputils";
import {BtnScrap} from "./components/btnScrap";
import {SnackbarType} from "./model/snackbarType";
import {SnackbarState} from "./model/snackbarState";
import {Snackbar} from "./components/snackbar";
import {sendScrapMessage} from "./util/messanger";
import {ScriptResponse} from "./model/response";

const Popup = () => {
    const [hostname, setHostname] = useState<string>();
    const [operationActive, setOperationActive] = useState<boolean>(false);
    const [count, setCount] = useState(0);
    const [currentURL, setCurrentURL] = useState<string>();
    const [scraps, setScraps] = useState<Scrap[]>([]);
    const [snackbar, setSnackbar] = useState<SnackbarState>({ isOpen: false,  type: SnackbarType.INFO, text: ''});

    /** Startup function on popup click */
    const init = () => {
        console.log("Initializing popup ...");
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            console.log("Checking hostname...")
            let tempUrl = tabs[0].url;
            console.log("Current URL: ", tempUrl);
            let hostname = getHostnameFromUrl(tempUrl);
            console.log("Hostname: ", hostname);
            let activeScraps = getScrapsFromHostname(hostname);
            console.log("Scraps for this hostname: ", activeScraps);
            setCurrentURL(tempUrl);
            setHostname(hostname)
            setScraps(activeScraps)
            setCount(activeScraps.length)
        });
    }

    const setSnackbarTimeout = () => {
        setTimeout(() => { setSnackbar({ isOpen: false, type: SnackbarType.INFO, text: '' }); }, 3000);
    }

    const showSuccessSnackbar = (text: string) => {
        setSnackbar({ isOpen: true, type: SnackbarType.SUCCESS, text: text });
        setSnackbarTimeout();
    }

    const showErrorSnackbar = (text: string) => {
        setSnackbar({ isOpen: true, type: SnackbarType.ERROR, text: text });
        setSnackbarTimeout();
    }

    const updateBadgeText = () => {
        chrome.action.setBadgeText({text: count.toString()}).then(r =>{});
    }

    useEffect(() => { init() }, []);
    useEffect(() => { updateBadgeText() }, [count]);

    const handleScrapClick = (scrap: Scrap) => {
        console.log('Hai cliccato su', scrap.id);

        let onResponse = (response: ScriptResponse) => {
            if(response.resStatus) {
                showSuccessSnackbar(response.message)
            } else {
                showErrorSnackbar(response.message)
            }
        }
        sendScrapMessage(scrap, onResponse)
    };




    return (
        <>
            <div className="sectionTitle">
                <h1>Scrapliz</h1>
                <h3>{hostname}</h3>
            </div>

            <Snackbar isOpen={snackbar.isOpen} type={snackbar.type} text={snackbar.text} />

            <div className="container">
                { scraps.length != 0 ?
                    (
                        scraps.map((scrap, index) => {
                            return (
                                <BtnScrap
                                    key={scrap.id}
                                    scrap={scrap}
                                    operationActive={operationActive}
                                    onClick={ () => handleScrapClick(scrap)}
                                />
                            )
                        })
                    ) : <p>No action found for this website!</p>
                }
            </div>
        </>
    );
};

const root = createRoot(document.getElementById("root")!);

root.render(
    <Popup />
);
