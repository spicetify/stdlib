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
import { classnames } from "../webpack/ClassNames.js";
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
let topbarRightButtonFactoryCtx;
globalThis.__renderTopbarRightButtons = ()=>React.createElement(()=>{
        [, refresh] = React.useReducer((n)=>n + 1, 0);
        const topbarRightButtonFactory = isTouchscreenUi() ? _TopbarRightButtonT : _TopbarRightButton;
        if (!topbarRightButtonFactoryCtx) topbarRightButtonFactoryCtx = React.createContext(null);
        return /*#__PURE__*/ React.createElement(topbarRightButtonFactoryCtx.Provider, {
            value: topbarRightButtonFactory
        }, registry.all().reverse());
    });
transformer((emit)=>(str)=>{
        str = str.replace(/("login-button"[^\}]*\}[^\}]*\}[^\}]*\}\))/, "$1,__renderTopbarRightButtons()");
        emit();
        return str;
    }, {
    glob: /^\/xpui\.js/
});
export const TopbarRightButton = (props)=>{
    const TopbarRightButtonFactory = React.useContext(topbarRightButtonFactoryCtx);
    return TopbarRightButtonFactory && /*#__PURE__*/ React.createElement(TopbarRightButtonFactory, props);
};
const _TopbarRightButtonT = (props)=>/*#__PURE__*/ React.createElement(Tooltip, {
        label: props.label
    }, /*#__PURE__*/ React.createElement(UI.ButtonTertiary, {
        "aria-label": props.label,
        onClick: props.onClick,
        size: "small",
        condensedAll: true,
        className: "OomFKn3bsxs5JfNUoWhz"
    }, props.icon && createIconComponent({
        icon: props.icon,
        iconSize: 16,
        realIconSize: 24
    })));
const _TopbarRightButton = (props)=>/*#__PURE__*/ React.createElement(Tooltip, {
        label: props.label
    }, /*#__PURE__*/ React.createElement("button", {
        "aria-label": props.label,
        className: classnames("encore-over-media-set", "WtC1lGbmQRplD6JBhNFU"),
        onClick: props.onClick,
        disabled: props.disabled
    }, props.icon && createIconComponent({
        icon: props.icon,
        iconSize: 16
    })));
