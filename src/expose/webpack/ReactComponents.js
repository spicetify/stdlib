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
 */ import { capitalize } from "../../../deps.js";
import { Platform } from "../Platform.js";
import { chunks, exportedForwardRefs, exportedFunctions, exportedMemos, modules, require } from "./index.js";
import { findBy } from "/hooks/util.js";
import { React } from "../React.js";
const MenuTypes = {
    album: "Album",
    show: "PodcastShow",
    artist: "Artist",
    track: "Track"
};
export const Menus = Object.fromEntries(exportedMemos.flatMap((m)=>{
    const str = m.type.toString();
    const match = str.match(/value:"([\w-]+)"/);
    const name = match?.[1] ?? "";
    // @ts-ignore
    const type = MenuTypes[name];
    return type ? [
        [
            type,
            m
        ]
    ] : [];
}));
const [ContextMenuModuleID] = chunks.find(([_, v])=>v.toString().includes("toggleContextMenu"));
const [playlistMenuChunkID] = chunks.find(([, v])=>v.toString().includes('value:"playlist"') && v.toString().includes("canView") && v.toString().includes("permissions"));
Menus.Playlist = Object.values(require(playlistMenuChunkID)).find((m)=>typeof m === "function" || typeof m === "object");
export const Cards = Object.assign({
    Generic: findBy("cardPlayButtonFactory", "featureIdentifier", "variant")(exportedFunctions),
    HeroGeneric: findBy("cardPlayButtonFactory", "featureIdentifier", "getSignifierContent")(exportedFunctions),
    CardImage: findBy('"card-image"')(exportedFunctions)
}, Object.fromEntries([
    exportedFunctions.map((m)=>{
        try {
            const str = m.toString();
            const match = str.match(/featureIdentifier:"(.+?)"/);
            if (!match) return [];
            const name = match[1];
            return [
                [
                    capitalize(name),
                    m
                ]
            ];
        } catch (e) {
            return [];
        }
    }),
    exportedMemos.map((m)=>{
        try {
            const str = m.type.toString();
            const match = str.match(/featureIdentifier:"(.+?)"/);
            if (!match) return [];
            const name = match[1];
            return [
                [
                    capitalize(name),
                    m
                ]
            ];
        } catch (e) {
            return [];
        }
    })
].flat(2)));
export const RemoteConfigProviderComponent = findBy("resolveSuspense", "configuration")(exportedFunctions);
export const Slider = exportedFunctions.find((m)=>m.toString().includes("onStepBackward") && !m.toString().includes("volume"));
const exportedMemoFRefs = exportedMemos.filter((m)=>m.type.$$typeof === Symbol.for("react.forward_ref"));
export const Nav = exportedMemoFRefs.find((m)=>m.type.render.toString().includes("navigationalRoot"));
export const NavTo = exportedMemoFRefs.find((m)=>m.type.render.toString().includes("pageId"));
const { InstrumentedRedirect } = modules.find((e)=>e.InstrumentedRedirect);
export { InstrumentedRedirect };
export const SnackbarProvider = findBy("enqueueSnackbar called with invalid argument")(exportedFunctions);
export const SettingColumn = findBy("setSectionFilterMatchQueryValue", "filterMatchQuery")(exportedFunctions);
export const SettingText = findBy("textSubdued", "dangerouslySetInnerHTML")(exportedFunctions);
export const SettingToggle = findBy("condensed", "onSelected")(exportedFunctions);
export const ContextMenu = Object.values(require(ContextMenuModuleID))[0];
export const RightClickMenu = findBy("action", "open", "trigger", "right-click")(exportedFunctions);
export const ConfirmDialog = findBy("isOpen", "shouldCloseOnEsc", "onClose")(exportedFunctions);
export const Tooltip = findBy("hover-or-focus", "tooltip")(exportedFunctions);
export const Menu = findBy("getInitialFocusElement", "children")(exportedFunctions);
export const MenuItem = findBy("handleMouseEnter", "onClick")(exportedFunctions);
export const MenuItemSubMenu = findBy("subMenuIcon")(exportedFunctions);
export const RemoteConfigProvider = ({ configuration = Platform.getRemoteConfiguration(), children = undefined })=>React.createElement(RemoteConfigProviderComponent, {
        configuration
    }, children);
export const PanelHeader = exportedFunctions.find((m)=>m.toString().includes("panel") && m.toString().includes("actions"));
export const PanelContent = findBy((m)=>m.render.toString().includes("scrollBarContainer"))(exportedForwardRefs) || findBy("scrollBarContainer")(exportedFunctions);
export const PanelSkeleton = findBy("label", "aside")(exportedFunctions) || findBy((m)=>m.render.toString().includes("section"))(exportedForwardRefs);
export const Snackbar = {
    wrapper: findBy("encore-light-theme", "elevated")(exportedFunctions),
    simpleLayout: findBy("leading", "center", "trailing")(exportedFunctions),
    ctaText: findBy("ctaText")(exportedFunctions),
    styledImage: findBy("placeholderSrc")(exportedFunctions)
};
export const FilterBox = exportedMemos.find((f)=>f.type.toString().includes("filterBoxApiRef"));
export const ScrollableContainer = findBy("scrollLeft", "showButtons")(exportedFunctions);
export const ScrollableText = findBy("scrollLeft", "pauseAtEndEdgeDurationMs")(exportedFunctions);
export const Toggle = findBy("onSelected", 'type:"checkbox"')(exportedFunctions);
export const Router = findBy("navigationType", "static")(exportedFunctions);
export const Routes = findBy(/\([a-zA-Z_\$][\w\$]*\)\{let\{children:[a-zA-Z_\$][\w\$]*,location:[a-zA-Z_\$][\w\$]*\}=[a-zA-Z_\$][\w\$]*/)(exportedFunctions);
export const Route = findBy(/^function [a-zA-Z_\$][\w\$]*\([a-zA-Z_\$][\w\$]*\)\{\(0,[a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*\)\(\!1\)\}$/)(exportedFunctions);
export const StoreProvider = findBy("notifyNestedSubs", "serverState")(exportedFunctions);
export const GenericModal = findBy("GenericModal")(exportedFunctions);
export const Tracklist = exportedMemos.find((f)=>f.type.toString().includes("nrValidItems"));
export const TracklistRow = exportedMemos.find((f)=>f.type.toString().includes("track-icon"));
export const TracklistColumnsContextProvider = findBy("columnType")(exportedFunctions);
