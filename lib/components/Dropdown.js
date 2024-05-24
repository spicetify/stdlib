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
import { createIconComponent } from "../createIconComponent.js";
import { ContextMenu, Menu, MenuItem } from "../../src/webpack/ReactComponents.js";
import { UI } from "../../src/webpack/ComponentLibrary.js";
const CheckIcon = ()=>createIconComponent({
        // TODO
        icon: "" /*  SVGIcons.check */ 
    });
const DropdownMenuItem = ({ option, isActive, onSwitch, children })=>{
    const activeStyle = {
        backgroundColor: "rgba(var(--spice-rgb-selected-row),.1)"
    };
    return /*#__PURE__*/ React.createElement(MenuItem, {
        trigger: "click",
        onClick: ()=>onSwitch(option),
        "data-checked": isActive,
        trailingIcon: isActive ? /*#__PURE__*/ React.createElement(CheckIcon, null) : undefined,
        style: isActive ? activeStyle : undefined
    }, children);
};
export default function({ options, activeOption, onSwitch }) {
    const SelectedOption = options[activeOption];
    if (Object.keys(options).length === 1) {
        return /*#__PURE__*/ React.createElement("button", {
            className: "w6j_vX6SF5IxSXrrkYw5",
            type: "button",
            role: "combobox",
            "aria-expanded": "false"
        }, /*#__PURE__*/ React.createElement(UI.Type, {
            variant: "mesto",
            semanticColor: "textSubdued"
        }, /*#__PURE__*/ React.createElement(SelectedOption, {
            preview: true
        })));
    }
    const DropdownMenu = (props)=>{
        return /*#__PURE__*/ React.createElement(Menu, props, Object.entries(options).map(([option, Children])=>/*#__PURE__*/ React.createElement(DropdownMenuItem, {
                option: option,
                isActive: option === activeOption,
                onSwitch: onSwitch
            }, /*#__PURE__*/ React.createElement(Children, null))));
    };
    return /*#__PURE__*/ React.createElement(ContextMenu, {
        menu: /*#__PURE__*/ React.createElement(DropdownMenu, null),
        trigger: "click"
    }, /*#__PURE__*/ React.createElement("button", {
        className: "w6j_vX6SF5IxSXrrkYw5",
        type: "button",
        role: "combobox",
        "aria-expanded": "false"
    }, /*#__PURE__*/ React.createElement(UI.Type, {
        variant: "mesto",
        semanticColor: "textSubdued"
    }, /*#__PURE__*/ React.createElement(SelectedOption, {
        preview: true
    })), createIconComponent({
        icon: `<path d="m14 6-6 6-6-6h12z" />`
    })));
}
