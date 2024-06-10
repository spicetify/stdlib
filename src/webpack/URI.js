/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { chunks, require } from "./index.js";
import { capitalize } from "../../deps.js";
export let Types;
export let isSameIdentity;
export let urlEncode;
export let idToHex;
export let hexToId;
export let from;
export let fromString;
export let is;
export let create;
CHUNKS.xpui.promise.then(()=>{
    const [URIModuleID] = chunks.find(([id, v])=>v.toString().includes("Invalid Spotify URI!") && Object.keys(require(id)).length > 10);
    const URIModule = require(URIModuleID);
    const [_Types, ...vs] = Object.values(URIModule);
    Types = _Types;
    const TypesKeys = Object.keys(Types);
    const isTestFn = (fn)=>TypesKeys.some((t)=>fn.toString().includes(`${t}}`));
    const isCreateFn = (fn)=>TypesKeys.some((t)=>fn.toString().includes(`${t},`));
    const CaseLikeThis = (s)=>s.split("_").map(capitalize).join("");
    const fnsByType = Object.groupBy(vs, (fn)=>isTestFn(fn) ? "test" : isCreateFn(fn) ? "create" : undefined);
    is = Object.fromEntries(fnsByType.test.map((fn)=>[
            CaseLikeThis(fn.toString().match(/([\w_\d]{2,})\}/)[1]),
            fn
        ]));
    create = Object.fromEntries(fnsByType.create.map((fn)=>[
            CaseLikeThis(fn.toString().match(/([\w_\d]{2,})\,/)[1]),
            fn
        ]));
    const uniqueFns = fnsByType[undefined];
    const findAndExcludeBy = (...strings)=>{
        const i = uniqueFns.findIndex((f)=>strings.every((str)=>f.toString().includes(str)));
        return uniqueFns.splice(i, 1)[0];
    };
    isSameIdentity = findAndExcludeBy("PLAYLIST");
    urlEncode = findAndExcludeBy(".URI");
    idToHex = findAndExcludeBy("22===");
    hexToId = findAndExcludeBy("32===");
    from = findAndExcludeBy("allowedTypes");
    fromString = findAndExcludeBy("Argument `uri` must be a string.");
    is.PlaylistV1OrV2 = findAndExcludeBy(`${is.Playlist.name}(e)||${is.PlaylistV2.name}(e)`);
});
