/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { React } from "../expose/React.js";
import { createIconComponent } from "../../lib/createIconComponent.js";
import { transformer } from "../../mixin.js";
import { Tooltip } from "../webpack/ReactComponents.js";
import { UI } from "../webpack/ComponentLibrary.js";
import { classnames } from "../webpack/ClassNames.js";
import { Registry } from "./registry.js";
const registry = new Registry();
export default registry;
globalThis.__renderPlaybarBarControls = ()=>registry.all().reverse();
transformer((emit)=>(str)=>{
        str = str.replace(/(children:\[)([^\[]*djJumpButtonFactory)/, "$1...__renderPlaybarBarControls(),$2");
        emit();
        return str;
    }, {
    glob: /^\/xpui\.js/
});
export const PlaybarButton = ({ label, isActive = false, isActiveNoIndicator = false, disabled = false, icon, onClick })=>/*#__PURE__*/ React.createElement(Tooltip, {
        label: label
    }, /*#__PURE__*/ React.createElement(UI.ButtonTertiary, {
        "aria-label": label,
        size: "small",
        className: classnames("KAZD28usA1vPz5GVpm63", {
            ["EHxL6K_6WWDlTCZP6x5w"]: isActive,
            ["RK45o6dbvO1mb0wQtSwq"]: isActive || isActiveNoIndicator
        }),
        disabled: disabled,
        iconOnly: icon && (()=>createIconComponent({
                icon
            })),
        onClick: onClick,
        "data-active": isActive.toString(),
        "aria-pressed": isActive
    }));
