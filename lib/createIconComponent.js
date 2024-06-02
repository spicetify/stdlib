/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { React } from "../src/expose/React.js";
import { UI } from "../src/webpack/ComponentLibrary.js";
export const createIconComponent = ({ icon, iconSize = 16, realIconSize = iconSize, ...props })=>{
    return /*#__PURE__*/ React.createElement(UI.Icon, {
        autoMirror: false,
        iconSize: realIconSize,
        viewBox: `0 0 ${iconSize} ${iconSize}`,
        dangerouslySetInnerHTML: {
            __html: icon
        },
        ...props
    });
};
