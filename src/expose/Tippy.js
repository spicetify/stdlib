/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { transformer } from "../../mixin.js";
export let Tippy;
transformer((emit)=>(str)=>{
        str = str.replace(/(([a-zA-Z_\$][\w\$]*)\.setDefaultProps=)/, "__Tippy=$2;$1");
        Object.defineProperty(globalThis, "__Tippy", {
            set: emit
        });
        return str;
    }, {
    then: ($)=>{
        Tippy = $;
    },
    glob: /^\/vendor~xpui\.js/
});
