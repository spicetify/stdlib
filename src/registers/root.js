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
 */ import { matchLast } from "/hooks/util.js";
import { transformer } from "../../mixin.js";
import { Registry } from "./registry.js";
const registry = new class extends Registry {
    add(value) {
        refreshRoot.then((f)=>f());
        return super.add(value);
    }
    delete(value) {
        refreshRoot.then((f)=>f());
        return super.delete(value);
    }
};
export default registry;
let resolveRefreshRoot;
const refreshRoot = new Promise((r)=>{
    resolveRefreshRoot = r;
});
globalThis.__renderRootChildren = ()=>registry.all();
transformer((emit)=>(str)=>{
        const croppedInput = str.match(/.*"data-right-sidebar-hidden"/)[0];
        const children = matchLast(croppedInput, /children:([a-zA-Z_\$][\w\$]*)/g)[1];
        str = str.replace(/("data-right-sidebar-hidden")/, `[(${children}=[${children},__renderRootChildren()].flat(),$1)]`);
        const react = matchLast(croppedInput, /([a-zA-Z_\$][\w\$]*)\.useCallback/g)[1];
        const index = matchLast(croppedInput, /return/g).index;
        str = `${str.slice(0, index)}__refreshRoot=${react}.useReducer(n=>n+1,0)[1];${str.slice(index)}`;
        Object.defineProperty(globalThis, "__refreshRoot", {
            set: emit
        });
        return str;
    }, {
    then: ($)=>{
        resolveRefreshRoot($);
    },
    glob: /^\/xpui\.js/
});
