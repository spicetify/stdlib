/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { modules } from "./index.js";
export let Mousetrap;
CHUNKS.xpui.promise.then(()=>{
    Mousetrap = modules.find((m)=>m.addKeycodes);
});
