/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { transformer } from "../../mixin.js";
export let SettingsSection;
export const future = {
    push: ()=>{},
    pull (fn) {
        const push = this.push;
        this.push = ()=>{
            push();
            fn();
        };
    }
};
export let SettingsSectionTitle;
transformer((emit)=>(str)=>{
        str = str.replace(/(\.jsxs\)\()([a-zA-Z_\$][\w\$]*)([^=]*"desktop.settings.compatibility")/, "$1(__SettingsSection=$2)$3");
        Object.defineProperty(globalThis, "__SettingsSection", {
            set: emit
        });
        return str;
    }, {
    then: ($)=>{
        SettingsSection = $;
        future.push();
    },
    glob: /^\/xpui-routes-desktop-settings\.js/,
    noAwait: true
});
transformer((emit)=>(str)=>{
        str = str.replace(/("desktop.settings.compatibility"[^=]*?\.jsx\)\()([a-zA-Z_\$][\w\$]*)/, "$1(__SettingsSectionTitle=$2)");
        Object.defineProperty(globalThis, "__SettingsSectionTitle", {
            set: emit
        });
        return str;
    }, {
    then: ($)=>{
        SettingsSectionTitle = $;
    },
    glob: /^\/xpui-routes-desktop-settings\.js/,
    noAwait: true
});
