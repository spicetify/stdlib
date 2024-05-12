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
 */ const exposeURI = ({ require, chunks })=>{
    const [URIModuleID] = chunks.find(([id, v])=>v.toString().includes("Invalid Spotify URI!") && Object.keys(require(id)).length > 10);
    const URIModule = require(URIModuleID);
    const [Types, ...vs] = Object.values(URIModule);
    const TypesKeys = Object.keys(Types);
    const isTestFn = (fn)=>TypesKeys.some((t)=>fn.toString().includes(`${t}}`));
    const isCreateFn = (fn)=>TypesKeys.some((t)=>fn.toString().includes(`${t},`));
    const CaseLikeThis = (s)=>s.split("_").map(capitalize).join("");
    const fnsByType = Object.groupBy(vs, (fn)=>isTestFn(fn) ? "test" : isCreateFn(fn) ? "create" : undefined);
    const is = Object.fromEntries(fnsByType.test.map((fn)=>[
            CaseLikeThis(fn.toString().match(/([\w_\d]{2,})\}/)[1]),
            fn
        ]));
    const create = Object.fromEntries(fnsByType.create.map((fn)=>[
            CaseLikeThis(fn.toString().match(/([\w_\d]{2,})\,/)[1]),
            fn
        ]));
    const uniqueFns = fnsByType[undefined];
    const findAndExcludeBy = (...strings)=>{
        const i = uniqueFns.findIndex((f)=>strings.every((str)=>f.toString().includes(str)));
        return uniqueFns.splice(i, 1)[0];
    };
    const isSameIdentity = findAndExcludeBy("PLAYLIST");
    const urlEncode = findAndExcludeBy(".URI");
    const idToHex = findAndExcludeBy("22===");
    const hexToId = findAndExcludeBy("32===");
    const from = findAndExcludeBy("allowedTypes");
    const fromString = findAndExcludeBy("Argument `uri` must be a string.");
    const is_PlaylistV1orV2 = findAndExcludeBy(`${is.Playlist.name}(e)||${is.PlaylistV2.name}(e)`);
    return {
        Types,
        isSameIdentity,
        urlEncode,
        idToHex,
        hexToId,
        from,
        fromString,
        is: Object.assign(is, {
            PlaylistV1OrV2: is_PlaylistV1orV2
        }),
        create
    };
};
export { };
