/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { transformer } from "../../mixin.js";
export let ReactFlipToolkitSpring;
transformer((emit)=>(str)=>{
        str = str.replace(/([a-zA-Z_\$][\w\$]*)=((?:function|\()([\w$.,{}()= ]+(?:springConfig|overshootClamping)){2})/, "$1=__ReactFlipToolkitSpring=$2");
        Object.defineProperty(globalThis, "__ReactFlipToolkitSpring", {
            set: emit
        });
        return str;
    }, {
    then: ($)=>{
        ReactFlipToolkitSpring = $;
    },
    glob: /^\/vendor~xpui\.js/
});
