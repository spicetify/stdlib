/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ export let require;
export let chunks;
export let modules;
export let exports;
export let exportedFunctions;
export let exportedReactObjects;
export let exportedContexts;
export let exportedForwardRefs;
export let exportedMemos;
export const analyzeWebpackRequire = (require)=>{
    const chunks = Object.entries(require.m);
    const modules = chunks.map(([id])=>require(id));
    const exports = modules.filter((module)=>typeof module === "object").flatMap((module)=>{
        try {
            return Object.values(module);
        } catch (_) {}
    }).filter(Boolean);
    const isFunction = (obj)=>typeof obj === "function";
    const exportedFunctions = exports.filter(isFunction);
    const exportedReactObjects = Object.groupBy(exports, (x)=>x.$$typeof);
    const exportedContexts = exportedReactObjects[Symbol.for("react.context")];
    const exportedForwardRefs = exportedReactObjects[Symbol.for("react.forward_ref")];
    const exportedMemos = exportedReactObjects[Symbol.for("react.memo")];
    return {
        chunks,
        modules,
        exports,
        exportedFunctions,
        exportedReactObjects,
        exportedContexts,
        exportedForwardRefs,
        exportedMemos
    };
};
CHUNKS["/vendor~xpui.js"] ??= Promise.withResolvers();
CHUNKS["/xpui.js"] ??= Promise.withResolvers();
Object.assign(CHUNKS, {
    xpui: {
        promise: Promise.all([
            CHUNKS["/vendor~xpui.js"].promise,
            CHUNKS["/xpui.js"].promise
        ])
    }
});
CHUNKS.xpui.promise.then(()=>{
    require = globalThis.webpackChunkclient_web.push([
        [
            Symbol()
        ],
        {},
        (re)=>re
    ]);
    const analysis = analyzeWebpackRequire(require);
    chunks = analysis.chunks;
    modules = analysis.modules;
    exports = analysis.exports;
    exportedFunctions = analysis.exportedFunctions;
    exportedReactObjects = analysis.exportedReactObjects;
    exportedContexts = analysis.exportedContexts;
    exportedForwardRefs = analysis.exportedForwardRefs;
    exportedMemos = analysis.exportedMemos;
});
