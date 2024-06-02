/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { webpackLoaded } from "../../mixin.js";
export let require;
export let chunks;
export let modules;
export let exports;
export let exportedFunctions;
export let exportedReactObjects;
export let exportedContexts;
export let exportedForwardRefs;
export let exportedMemos;
webpackLoaded.subscribe((loaded)=>{
    if (!loaded) {
        return;
    }
    require = globalThis.webpackChunkclient_web.push([
        [
            Symbol()
        ],
        {},
        (re)=>re
    ]);
    chunks = Object.entries(require.m);
    modules = chunks.map(([id])=>require(id));
    exports = modules.filter((module)=>typeof module === "object").flatMap((module)=>{
        try {
            return Object.values(module);
        } catch (_) {}
    }).filter(Boolean);
    const isFunction = (obj)=>typeof obj === "function";
    exportedFunctions = exports.filter(isFunction);
    exportedReactObjects = Object.groupBy(exports, (x)=>x.$$typeof);
    exportedContexts = exportedReactObjects[Symbol.for("react.context")];
    exportedForwardRefs = exportedReactObjects[Symbol.for("react.forward_ref")];
    exportedMemos = exportedReactObjects[Symbol.for("react.memo")];
});
