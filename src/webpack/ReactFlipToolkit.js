/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { webpackLoaded } from "../../mixin.js";
import { exportedFunctions } from "./index.js";
export let Flipper;
export let Flipped;
webpackLoaded.subscribe((loaded)=>{
    if (!loaded) {
        return;
    }
    Flipper = exportedFunctions.find((m)=>m.prototype?.getSnapshotBeforeUpdate);
    Flipped = exportedFunctions.find((m)=>m.displayName === "Flipped");
});
