/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import "../../mixin.js";
import { exportedFunctions } from "./index.js";
import { findBy } from "/hooks/util.js";
export let useSnackbar;
export let enqueueCustomSnackbar;
CHUNKS.xpui.promise.then(()=>{
    useSnackbar = findBy(/^function\(\)\{return\(0,[a-zA-Z_\$][\w\$]*\.useContext\)\([a-zA-Z_\$][\w\$]*\)\}$/)(exportedFunctions);
    enqueueCustomSnackbar = findBy("enqueueCustomSnackbar", "headless")(exportedFunctions);
});
