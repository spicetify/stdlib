/* Copyright © 2024
 *      Delusoire <deluso7re@outlook.com>
 *
 * This file is part of bespoke/modules/stdlib.
 *
 * bespoke/modules/stdlib is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * bespoke/modules/stdlib is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with bespoke/modules/stdlib. If not, see <https://www.gnu.org/licenses/>.
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
