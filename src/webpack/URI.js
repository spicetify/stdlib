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
 */ import { chunks, require } from "./index.js";
import { capitalize } from "../../deps.js";
import { webpackLoaded } from "../../mixin.js";
export let Types;
export let isSameIdentity;
export let urlEncode;
export let idToHex;
export let hexToId;
export let from;
export let fromString;
export let is;
export let create;
webpackLoaded.subscribe((loaded)=>{
    if (!loaded) {
        return;
    }
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
