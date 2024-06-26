/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { exportedForwardRefs, exportedFunctions, exports } from "./index.js";
export let UI;
CHUNKS.xpui.promise.then(()=>{
    const componentNames = Object.keys(exports.find((e)=>e.BrowserDefaultFocusStyleProvider));
    const componentRegexes = componentNames.map((n)=>new RegExp(`"data-encore-id":(?:[a-zA-Z_\$][\w\$]*\\.){2}${n}\\b`));
    const componentPairs = [
        exportedFunctions.map((f)=>[
                f,
                f
            ]),
        exportedForwardRefs.map((f)=>[
                f.render,
                f
            ])
    ].flat().map(([s, f])=>[
            componentNames.find((n, i)=>s.toString().match(componentRegexes[i])),
            f
        ]);
    UI = Object.fromEntries(componentPairs);
});
