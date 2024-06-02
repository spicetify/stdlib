/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { webpackLoaded } from "../../mixin.js";
import { Platform } from "../expose/Platform.js";
import { exportedFunctions, exports } from "./index.js";
import { findBy } from "/hooks/util.js";
export let DragHandler;
export let useExtractedColor;
export let usePanelAPI;
export let imageAnalysis;
export let fallbackPreset;
export let extractColorPreset = async (image)=>{
    const analysis = await imageAnalysis(Platform.getGraphQLLoader(), image);
    for (const result of analysis){
        if ("isFallback" in result === false) {
            result.isFallback = fallbackPreset === result; // Why ?
        }
    }
    return analysis;
};
export let getPlayContext;
export let useContextMenuState;
export let useLocation;
webpackLoaded.subscribe((loaded)=>{
    if (!loaded) {
        return;
    }
    DragHandler = findBy("dataTransfer", "data-dragging")(exportedFunctions);
    useExtractedColor = exportedFunctions.find((m)=>m.toString().includes("extracted-color") || m.toString().includes("colorRaw") && m.toString().includes("useEffect"));
    usePanelAPI = findBy("panelSend", "context")(exportedFunctions);
    useContextMenuState = findBy("useContextMenuState")(exportedFunctions);
    imageAnalysis = findBy(/\![a-zA-Z_\$][\w\$]*\.isFallback|\{extractColor/)(exportedFunctions);
    fallbackPreset = exports.find((m)=>m.colorDark);
    getPlayContext = findBy("referrerIdentifier", "usePlayContextItem")(exportedFunctions);
    useLocation = findBy("location", "useContext")(exportedFunctions);
});
