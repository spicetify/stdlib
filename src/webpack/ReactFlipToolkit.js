/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { exportedFunctions } from "./index.js";
export let Flipper;
export let Flipped;
CHUNKS.xpui.promise.then(()=>{
    Flipper = exportedFunctions.find((m)=>m.prototype?.getSnapshotBeforeUpdate);
    Flipped = exportedFunctions.find((m)=>m.displayName === "Flipped");
});
