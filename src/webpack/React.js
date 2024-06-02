/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { webpackLoaded } from "../../mixin.js";
import { modules } from "./index.js";
export let ReactJSX;
export let ReactDOM;
export let ReactDOMServer;
webpackLoaded.subscribe((loaded)=>{
    if (!loaded) {
        return;
    }
    ReactJSX = modules.find((m)=>m.jsx);
    ReactDOM = modules.find((m)=>m.createRoot);
    ReactDOMServer = modules.find((m)=>m.renderToString);
});
