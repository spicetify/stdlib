/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { webpackLoaded } from "../../mixin.js";
import { modules } from "./index.js";
export let Mousetrap;
webpackLoaded.subscribe((loaded)=>{
    if (!loaded) {
        return;
    }
    Mousetrap = modules.find((m)=>m.addKeycodes);
});
