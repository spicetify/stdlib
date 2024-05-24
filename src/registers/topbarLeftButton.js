/* Copyright © 2024
 *      Delusoire <deluso7re@outlook.com>
 *
 * This file is part of bespoke/modules/stdlib.
 *
 * bespoke/modules/stdlib is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * bespoke/modules/stdlib is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with bespoke/modules/stdlib. If not, see <https://www.gnu.org/licenses/>.
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
};
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
