/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { webpackLoaded } from "../../mixin.js";
import { exportedFunctions, exports } from "./index.js";
import { findBy } from "/hooks/util.js";
export let Color;
export let Locale;
export let createUrlLocale;
export let InternalPropetyMap;
webpackLoaded.subscribe((loaded)=>{
    if (!loaded) {
        return;
    }
    Color = Object.assign(findBy("this.rgb")(exportedFunctions), {
        Format: exports.find((m)=>m.RGBA)
    });
    Locale = exports.find((m)=>m.getTranslations);
    createUrlLocale = findBy("has", "baseName", "language")(exportedFunctions);
    InternalPropetyMap = exports.find((o)=>o.Builder);
});
