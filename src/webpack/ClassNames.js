/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { webpackLoaded } from "../../mixin.js";
import { chunks, require } from "./index.js";
export let classnames;
webpackLoaded.subscribe((loaded)=>{
    if (!loaded) {
        return;
    }
    classnames = chunks.filter(([_, v])=>v.toString().includes("[native code]")).map(([i])=>require(i)).find((e)=>typeof e === "function");
});
