/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { modules } from "./index.js";
export let ReactJSX;
export let ReactDOM;
export let ReactDOMServer;
CHUNKS.xpui.promise.then(()=>{
    ReactJSX = modules.find((m)=>m.jsx);
    ReactDOM = modules.find((m)=>m.createRoot);
    ReactDOMServer = modules.find((m)=>m.renderToString);
});
