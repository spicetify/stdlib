/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { transformer } from "../../mixin.js";
export let ReduxStore;
transformer((emit)=>(str)=>{
        str = str.replace(/(,[a-zA-Z_\$][\w\$]*=)(([$\w,.:=;(){}]+\(\{session:[a-zA-Z_\$][\w\$]*,features:[a-zA-Z_\$][\w\$]*,seoExperiment:[a-zA-Z_\$][\w\$]*\}))/, "$1__ReduxStore=$2");
        Object.defineProperty(globalThis, "__ReduxStore", {
            set: emit
        });
        return str;
    }, {
    then: ($)=>{
        ReduxStore = $;
    },
    glob: /^\/xpui\.js/
});
