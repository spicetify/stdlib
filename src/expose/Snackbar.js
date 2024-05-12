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
 */ import { transformer } from "../../mixin.js";
export let Snackbar = null;
transformer((emit)=>(str)=>{
        str = str.replace(/(\.call\(this,[a-zA-Z_\$][\w\$]*\)\|\|this\)\.enqueueSnackbar)/, "$1=__Snackbar");
        let __Snackbar = undefined;
        Object.defineProperty(globalThis, "__Snackbar", {
            set: (value)=>{
                emit(value);
                __Snackbar = value;
            },
            get: ()=>__Snackbar
        });
        return str;
    }, {
    then: ($)=>{
        Snackbar = $;
    },
    glob: /^\/vendor~xpui\.js/
});
