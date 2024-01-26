import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {getDefaultUserSettings} from "./model/userSettings";

const Options = () => {
    const [scrapPath, setScrapPath] = useState<string>('')
    const [enableCopyright, setEnableCopyright] = useState<boolean>(false)

    useEffect(() => {
        chrome.storage.sync.get(getDefaultUserSettings(),
            (items) => {
                setScrapPath(items.scrapPath)
                setEnableCopyright(items.enableCopyright)
            }
        )
    }, [])

    return (
        <>

        </>
    );
};

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <Options />
    </React.StrictMode>
);
