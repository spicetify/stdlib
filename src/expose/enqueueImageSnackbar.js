/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { transformer } from "../../mixin.js";
export let enqueueImageSnackbar;
// TODO: replace with a custom enqueueCustomSnackbar wrapper
transformer((emit)=>(str)=>{
        str = str.replace(/(\(\({[^}]*,\s*imageSrc)/, "__enqueueImageSnackbar=$1");
        Object.defineProperty(globalThis, "__enqueueImageSnackbar", {
            set: emit
        });
        return str;
    }, {
    then: ($)=>{
        enqueueImageSnackbar = $;
    },
    glob: /^\/xpui\.js/,
    noAwait: true
});
