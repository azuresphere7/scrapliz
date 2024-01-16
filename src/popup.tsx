import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { loggiz } from "./utils";
import "./scss/body.scss";
import "./scss/typeography.scss";
import {getHostnameFromUrl} from "./util/urlutils";

const Popup = () => {
    const [hostname, setHostname] = useState<string>();
    const [count, setCount] = useState(0);
    const [currentURL, setCurrentURL] = useState<string>();



    useEffect(() => {
        chrome.action.setBadgeText({ text: count.toString() });
    }, [count]);

    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            console.log("Checking hostname...")
            let tempUrl = tabs[0].url;
            let hostname = getHostnameFromUrl(tempUrl);
            setCurrentURL(tempUrl);
            setHostname(hostname)
            console.log("Current URL: ", tempUrl);
            console.log("Hostname: ", hostname);
        });
    }, []);

    const changeBackground = () => {
        loggiz();
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tab = tabs[0];
            if (tab.id) {
                chrome.tabs.sendMessage(tab.id, { color: "#555555" }, (msg) => {
                    console.log("result message:", msg);
                });
            }
        });
    };

    return (
        <>
            <h1>Scrapliz</h1>
            <h3>{hostname}</h3>
        </>
    );
};

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);
