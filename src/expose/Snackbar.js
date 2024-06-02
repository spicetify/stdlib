/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { transformer } from "../../mixin.js";
export let Snackbar;
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
