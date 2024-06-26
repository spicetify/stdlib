/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { React } from "../src/expose/React.js";
import { UI } from "../src/webpack/ComponentLibrary.js";
import { Locale } from "../src/webpack/misc.js";
import { GenericModal } from "../src/webpack/ReactComponents.js";
import RootRegistry from "../src/registers/root.js";
import { createIconComponent } from "./createIconComponent.js";
let ref = undefined;
export function display({ title, content, isLarge }) {
    hide();
    RootRegistry.add(ref = /*#__PURE__*/ React.createElement(PopupModal, {
        contentLabel: title,
        children: content,
        isEmbedWidgetGeneratorOrTrackCreditsModal: isLarge
    }));
}
export function hide() {
    if (ref) {
        RootRegistry.delete(ref);
        ref = undefined;
    }
}
const PopupModal = (props)=>{
    const isOpen = true;
    if (props.isEmbedWidgetGeneratorOrTrackCreditsModal) {
        return /*#__PURE__*/ React.createElement(GenericModal, {
            isOpen: isOpen,
            contentLabel: props.contentLabel
        }, /*#__PURE__*/ React.createElement("div", {
            className: "uUYNnjSt8m3EqVjsnHgh",
            style: {
                overflow: "scroll",
                width: "60vw"
            }
        }, /*#__PURE__*/ React.createElement("div", {
            className: "bOIRpQiHUAEfp8ntStTo"
        }, /*#__PURE__*/ React.createElement(UI.Text, {
            as: "h1",
            variant: "titleSmall"
        }, props.contentLabel), /*#__PURE__*/ React.createElement("button", {
            className: "oBoIIlKrwQjxXpvOiOa0",
            onClick: hide
        }, createIconComponent({
            icon: "<path d='M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06Z'/>",
            "aria-label": Locale.get("close")
        }))), /*#__PURE__*/ React.createElement("div", {
            className: "IJHNf0vxPSbPE1egoG4N"
        }, props.children)));
    }
    return /*#__PURE__*/ React.createElement(GenericModal, {
        isOpen: isOpen,
        contentLabel: props.contentLabel
    }, /*#__PURE__*/ React.createElement("div", {
        className: "uV8q95GGAb2VDtL3gpYa"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "pGU_qEtNT1qWKjrRbvan"
    }, /*#__PURE__*/ React.createElement(UI.Text, {
        as: "h1",
        variant: "titleMedium"
    }, props.contentLabel), /*#__PURE__*/ React.createElement("button", {
        className: "VKCcyYujazVPj6VkksPM",
        "aria-label": Locale.get("close"),
        onClick: hide
    }, createIconComponent({
        icon: "<path d='M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06Z'/>",
        "aria-label": Locale.get("close"),
        iconSize: 18
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "Nw1INlIyra3LT1JjvoqH"
    }, props.children)));
};
