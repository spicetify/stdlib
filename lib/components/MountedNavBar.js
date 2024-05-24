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
 */ import { React } from "../../src/expose/React.js";
import { UI } from "../../src/webpack/ComponentLibrary.js";
import { ReactDOM } from "../../src/webpack/React.js";
import { NavTo, ScrollableContainer } from "../../src/webpack/ReactComponents.js";
import { isTouchscreenUi } from "../../src/utils/index.js";
const NavToChip = (props)=>/*#__PURE__*/ React.createElement(NavTo, {
        replace: true,
        to: props.to,
        tabIndex: -1,
        onClick: props.onClick,
        className: "ZWI7JsjzJaR_G8Hy4W6J"
    }, /*#__PURE__*/ React.createElement(UI.Chip, {
        selected: props.selected,
        selectedColorSet: "invertedLight",
        tabIndex: -1
    }, props.title));
const NavBar = ({ namespace, categories, selectedCategory })=>/*#__PURE__*/ React.createElement("div", {
        className: "fVB_YDdnaDlztX7CcWTA"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "e179_Eg8r7Ub6yjjxctr contentSpacing"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "VIeVCUUETJyYPCDpsBif"
    }, /*#__PURE__*/ React.createElement(ScrollableContainer, null, categories.map((category)=>/*#__PURE__*/ React.createElement(NavToChip, {
            to: `spotify:app:bespoke:${namespace}:${category}`,
            title: category,
            selected: category === selectedCategory
        }, category))))));
const TopBarMounted = (props)=>{
    const touchscreenUi = isTouchscreenUi();
    const component = /*#__PURE__*/ React.createElement("div", {
        className: "qHWqOt_TYlFxiF0Dm2fD",
        style: {
            pointerEvents: "all"
        }
    }, props.children);
    return touchscreenUi ? component : ReactDOM.createPortal(component, document.querySelector(".rovbQsmAS_mwvpKHaVhQ"));
};
export const TopNavBar = (props)=>/*#__PURE__*/ React.createElement(TopBarMounted, null, /*#__PURE__*/ React.createElement(NavBar, props));
