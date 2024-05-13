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
 */ import { Registry } from "./registry.js";
import { React } from "../expose/React.js";
import { createIconComponent } from "../../lib/createIconComponent.js";
import { transformer } from "../../mixin.js";
import { isTouchscreenUi } from "../utils/index.js";
import { Tooltip } from "../webpack/ReactComponents.js";
import { UI } from "../webpack/ComponentLibrary.js";
const registry = new class extends Registry {
    register(item, predicate) {
        super.register(item, predicate);
        refreshTopbarLeftButtons?.();
        return item;
    }
    unregister(item) {
        super.unregister(item);
        refreshTopbarLeftButtons?.();
        return item;
    }
}();
export default registry;
let refreshTopbarLeftButtons;
let topbarLeftButtonFactoryCtx;
globalThis.__renderTopbarLeftButtons = ()=>React.createElement(()=>{
        const [___, refresh] = React.useReducer((n)=>n + 1, 0);
        refreshTopbarLeftButtons = refresh;
        const topbarLeftButtonFactory = isTouchscreenUi() ? TopbarLeftButtonRound : TopbarLeftButtonSquare;
        if (!topbarLeftButtonFactoryCtx) topbarLeftButtonFactoryCtx = React.createContext(null);
        return /*#__PURE__*/ React.createElement(topbarLeftButtonFactoryCtx.Provider, {
            value: topbarLeftButtonFactory
        }, registry.getItems().map((TopbarLeftButton)=>/*#__PURE__*/ React.createElement(TopbarLeftButton, null)));
    });
transformer((emit)=>(str)=>{
        str = str.replace(/("top-bar-forward-button"[^\]]*)/g, "$1,__renderTopbarLeftButtons()");
        emit();
        return str;
    }, {
    glob: /^\/xpui\.js/
});
export const Button = (props)=>{
    const TopbarLeftButtonFactory = React.useContext(topbarLeftButtonFactoryCtx);
    return TopbarLeftButtonFactory && /*#__PURE__*/ React.createElement(TopbarLeftButtonFactory, props);
};
const TopbarLeftButtonRound = (props)=>/*#__PURE__*/ React.createElement(Tooltip, {
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
const TopbarLeftButtonSquare = (props)=>/*#__PURE__*/ React.createElement(Tooltip, {
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
