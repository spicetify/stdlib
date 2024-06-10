/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { exportedContexts } from "./index.js";
export let FilterContext;
CHUNKS.xpui.promise.then(()=>{
    FilterContext = exportedContexts.find((c)=>c._currentValue2?.setFilter);
});
