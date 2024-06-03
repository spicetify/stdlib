/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { transformer } from "../../mixin.js";
export let Platform;
export let Cosmos;
transformer((emit)=>(str)=>{
        str = str.replace(/(setTitlebarHeight[\w(){}.,&$!=;"" ]+)(\{version:[a-zA-Z_\$][\w\$]*,)/, "$1__Platform=$2");
        Object.defineProperty(globalThis, "__Platform", {
            set: emit
        });
        return str;
    }, {
    then: ($)=>{
        Platform = $;
        Cosmos = $.getRegistry().resolve(Symbol.for("Cosmos"));
    },
    glob: /^\/xpui\.js/
});
