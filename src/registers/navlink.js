/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { React } from "../expose/React.js";
import { findMatchingPos } from "/hooks/util.js";
import { createIconComponent } from "../../lib/createIconComponent.js";
import { transformer } from "../../mixin.js";
import { Platform } from "../expose/Platform.js";
import { classnames } from "../webpack/ClassNames.js";
import { Nav, ScrollableContainer, Tooltip } from "../webpack/ReactComponents.js";
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
let navLinkFactoryCtx;
globalThis.__renderNavLinks = (isTouchscreenUi)=>React.createElement(()=>{
        [, refresh] = React.useReducer((n)=>n + 1, 0);
        if (!ScrollableContainer) {
            return;
        }
        const navLinkFactory = isTouchscreenUi ? _NavLinkGlobal : _NavLinkSidebar;
        if (!navLinkFactoryCtx) navLinkFactoryCtx = React.createContext(null);
        const children = /*#__PURE__*/ React.createElement(navLinkFactoryCtx.Provider, {
            value: navLinkFactory
        }, registry.all());
        return isTouchscreenUi ? /*#__PURE__*/ React.createElement(ScrollableContainer, {
            className: "custom-navlinks-scrollable_container"
        }, children) : children;
    });
transformer((emit)=>(str)=>{
        const j = str.search(/\("li",\{[^\{]*\{[^\{]*\{to:"\/search/);
        const i = findMatchingPos(str, j, 1, [
            "(",
            ")"
        ], 1);
        str = `${str.slice(0, i)},__renderNavLinks(false)${str.slice(i)}`;
        str = str.replace(/(,[a-zA-Z_\$][\w\$]*===(?:[a-zA-Z_\$][\w\$]*\.){2}HOME_NEXT_TO_NAVIGATION&&.+?)\]/, "$1,__renderNavLinks(true)]");
        str = str.replace(/(\["\/","\/home\/")/, '$1,"/bespoke/*"');
        emit();
        return str;
    }, {
    glob: /^\/xpui\.js/
});
export const NavLink = (props)=>{
    const isActive = Platform.getHistory().location.pathname?.startsWith(props.appRoutePath);
    const createIcon = ()=>createIconComponent({
            icon: isActive ? props.activeIcon : props.icon,
            iconSize: 24
        });
    const NavLinkFactory = React.useContext(navLinkFactoryCtx);
    return NavLinkFactory && /*#__PURE__*/ React.createElement(NavLinkFactory, {
        localizedApp: props.localizedApp,
        appRoutePath: props.appRoutePath,
        createIcon: createIcon,
        isActive: isActive
    });
};
const _NavLinkSidebar = (props)=>{
    const isSidebarCollapsed = Platform.getLocalStorageAPI().getItem("ylx-sidebar-state") === 1;
    return /*#__PURE__*/ React.createElement("li", {
        className: "KAcp7QFuEYSouAsuC5i_ InvalidDropTarget"
    }, /*#__PURE__*/ React.createElement(Tooltip, {
        label: isSidebarCollapsed ? props.localizedApp : null,
        disabled: !isSidebarCollapsed,
        placement: "right"
    }, /*#__PURE__*/ React.createElement(Nav, {
        to: props.appRoutePath,
        referrer: "other",
        className: classnames("link-subtle", "hNvCMxbfz7HwgzLjt3IZ", {
            "Bh3b80dIrbc0keQ9kdso ": props.isActive
        }),
        onClick: ()=>undefined,
        "aria-label": props.localizedApp
    }, props.createIcon(), !isSidebarCollapsed && /*#__PURE__*/ React.createElement(UI.Text, {
        variant: "bodyMediumBold"
    }, props.localizedApp))));
};
const _NavLinkGlobal = (props)=>{
    return /*#__PURE__*/ React.createElement("div", {
        className: "inline-flex"
    }, /*#__PURE__*/ React.createElement(Tooltip, {
        label: props.localizedApp
    }, /*#__PURE__*/ React.createElement(UI.ButtonTertiary, {
        iconOnly: props.createIcon,
        className: classnames("bWBqSiXEceAj1SnzqusU", "jdlOKroADlFeZZQeTdp8", "cUwQnQoE3OqXqSYLT0hv", "custom-navlink", {
            voA9ZoTTlPFyLpckNw3S: props.isActive
        }),
        "aria-label": props.localizedApp,
        onClick: ()=>Platform.getHistory().push(props.appRoutePath)
    })));
};
