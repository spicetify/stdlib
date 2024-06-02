/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { React } from "../expose/React.js";
import { createIconComponent } from "../../lib/createIconComponent.js";
import { transformer } from "../../mixin.js";
import { isTouchscreenUi } from "../utils/index.js";
import { Tooltip } from "../webpack/ReactComponents.js";
import { UI } from "../webpack/ComponentLibrary.js";
import { Registry } from "./registry.js";
const registry = new class extends Registry {
    add(value) {
        refresh?.();
        return super.add(value);
    }
    delete(value) {
        refresh?.();
        return super.delete(value);
    }
}();
export default registry;
let refresh;
let topbarLeftButtonFactoryCtx;
globalThis.__renderTopbarLeftButtons = ()=>React.createElement(()=>{
        [, refresh] = React.useReducer((n)=>n + 1, 0);
        const topbarLeftButtonFactory = isTouchscreenUi() ? _TopbarLeftButtonT : _TopbarLeftButton;
        if (!topbarLeftButtonFactoryCtx) topbarLeftButtonFactoryCtx = React.createContext(null);
        return /*#__PURE__*/ React.createElement(topbarLeftButtonFactoryCtx.Provider, {
            value: topbarLeftButtonFactory
        }, registry.all());
    });
transformer((emit)=>(str)=>{
        str = str.replace(/("top-bar-forward-button"[^\]]*)/g, "$1,__renderTopbarLeftButtons()");
        emit();
        return str;
    }, {
    glob: /^\/xpui\.js/
});
export const TopbarLeftButton = (props)=>{
    const TopbarLeftButtonFactory = React.useContext(topbarLeftButtonFactoryCtx);
    return TopbarLeftButtonFactory && /*#__PURE__*/ React.createElement(TopbarLeftButtonFactory, props);
};
const _TopbarLeftButtonT = (props)=>/*#__PURE__*/ React.createElement(Tooltip, {
        label: props.label
    }, /*#__PURE__*/ React.createElement(UI.ButtonTertiary, {
        size: "medium",
        iconOnly: ()=>props.icon && createIconComponent({
                icon: props.icon,
                iconSize: 16,
                realIconSize: 24
            }),
        condensed: true,
        "aria-label": props.label,
        disabled: props.disabled,
        onClick: props.onClick,
        className: "rBX1EWVZ2EaPwP4y1Gkd"
    }));
const _TopbarLeftButton = (props)=>/*#__PURE__*/ React.createElement(Tooltip, {
        label: props.label
    }, /*#__PURE__*/ React.createElement("button", {
        "aria-label": props.label,
        disabled: props.disabled,
        className: "ql0zZd7giPXSnPg75NR0",
        onClick: props.onClick
    }, props.icon && createIconComponent({
        icon: props.icon,
        iconSize: 16,
        className: "IYDlXmBmmUKHveMzIPCF"
    })));
