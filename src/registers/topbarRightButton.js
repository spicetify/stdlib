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
import { Tooltip } from "../expose/webpack/ReactComponents.js";
import { UI } from "../expose/webpack/ComponentLibrary.js";
import { classnames } from "../expose/webpack/ClassNames.js";
const registry = new class extends Registry {
    register(item, predicate) {
        super.register(item, predicate);
        refreshTopbarRightButtons?.();
        return item;
    }
    unregister(item) {
        super.unregister(item);
        refreshTopbarRightButtons?.();
        return item;
    }
}();
export default registry;
let refreshTopbarRightButtons;
let topbarRightButtonFactoryCtx;
globalThis.__renderTopbarRightButtons = ()=>React.createElement(()=>{
        const [___, refresh] = React.useReducer((n)=>n + 1, 0);
        refreshTopbarRightButtons = refresh;
        const topbarRightButtonFactory = isTouchscreenUi() ? TopbarRightButtonRound : TopbarRightButtonSquare;
        if (!topbarRightButtonFactoryCtx) topbarRightButtonFactoryCtx = React.createContext(null);
        return /*#__PURE__*/ React.createElement(topbarRightButtonFactoryCtx.Provider, {
            value: topbarRightButtonFactory
        }, registry.getItems(undefined, true).map((TopbarRightButton)=>/*#__PURE__*/ React.createElement(TopbarRightButton, null)));
    });
transformer((emit)=>(str)=>{
        str = str.replace(/("login-button"[^\}]*\}[^\}]*\}[^\}]*\}\))/, "$1,__renderTopbarRightButtons()");
        emit();
        return str;
    }, {
    glob: /^\/xpui\.js/
});
export const Button = (props)=>{
    const TopbarRightButtonFactory = React.useContext(topbarRightButtonFactoryCtx);
    return TopbarRightButtonFactory && /*#__PURE__*/ React.createElement(TopbarRightButtonFactory, props);
};
const TopbarRightButtonRound = (props)=>/*#__PURE__*/ React.createElement(Tooltip, {
        label: props.label
    }, /*#__PURE__*/ React.createElement(UI.ButtonTertiary, {
        "aria-label": props.label,
        onClick: props.onClick,
        size: "small",
        condensedAll: true,
        className: CLASSMAP.main.topbar.right.button_t.wrapper
    }, props.icon && createIconComponent({
        icon: props.icon,
        iconSize: 16,
        realIconSize: 24
    })));
const TopbarRightButtonSquare = (props)=>/*#__PURE__*/ React.createElement(Tooltip, {
        label: props.label
    }, /*#__PURE__*/ React.createElement("button", {
        "aria-label": props.label,
        className: classnames("encore-over-media-set", CLASSMAP.main.topbar.right.button.wrapper),
        onClick: props.onClick,
        disabled: props.disabled
    }, props.icon && createIconComponent({
        icon: props.icon,
        iconSize: 16
    })));
