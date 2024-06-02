/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { webpackLoaded } from "../../mixin.js";
import { exportedContexts } from "./index.js";
export let FilterContext;
webpackLoaded.subscribe((loaded)=>{
    if (!loaded) {
        return;
    }
    FilterContext = exportedContexts.find((c)=>c._currentValue2?.setFilter);
});
