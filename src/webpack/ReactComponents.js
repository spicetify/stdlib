/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { capitalize } from "../../deps.js";
import { Platform } from "../expose/Platform.js";
import { analyzeWebpackRequire, chunks, exportedForwardRefs, exportedFunctions, exportedMemos, modules, require } from "./index.js";
import { findBy } from "/hooks/util.js";
import { React } from "../expose/React.js";
export let Menus;
export let Cards;
export let RemoteConfigProviderComponent;
export let Slider;
export let Nav;
export let NavTo;
export let InstrumentedRedirect;
export let SnackbarProvider;
export let SettingColumn;
export let SettingText;
export let SettingToggle;
export let ContextMenu;
export let RightClickMenu;
export let ConfirmDialog;
export let Tooltip;
export let Menu;
export let MenuItem;
export let MenuItemSubMenu;
export let RemoteConfigProvider;
export let PanelHeader;
export let PanelContent;
export let PanelSkeleton;
export let Snackbar;
export let FilterBox;
export let ScrollableContainer;
export let ScrollableText;
export let Toggle;
export let Router;
export let Routes;
export let Route;
export let StoreProvider;
export let GenericModal;
export let Tracklist;
export let TracklistRow;
export let TracklistColumnsContextProvider;
CHUNKS.xpui.promise.then(()=>{
    Menus = Object.fromEntries(exportedMemos.flatMap((m)=>{
        const str = m.type.toString();
        const match = str.match(/value:"([\w-]+)"/);
        const name = match?.[1] ?? "";
        const type = {
            album: "Album",
            show: "PodcastShow",
            artist: "Artist",
            track: "Track"
        }[name];
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
    Cards = Object.assign({
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
    RemoteConfigProviderComponent = findBy("resolveSuspense", "configuration")(exportedFunctions);
    Slider = exportedFunctions.find((m)=>m.toString().includes("onStepBackward") && !m.toString().includes("volume"));
    const exportedMemoFRefs = exportedMemos.filter((m)=>m.type.$$typeof === Symbol.for("react.forward_ref"));
    Nav = exportedMemoFRefs.find((m)=>m.type.render.toString().includes("navigationalRoot"));
    NavTo = exportedMemoFRefs.find((m)=>m.type.render.toString().includes("pageId"));
    InstrumentedRedirect = modules.find((e)=>e.InstrumentedRedirect).InstrumentedRedirect;
    SnackbarProvider = findBy("enqueueSnackbar called with invalid argument")(exportedFunctions);
    ContextMenu = Object.values(require(ContextMenuModuleID))[0];
    RightClickMenu = findBy("action", "open", "trigger", "right-click")(exportedFunctions);
    ConfirmDialog = findBy("isOpen", "shouldCloseOnEsc", "onClose")(exportedFunctions);
    Tooltip = findBy("hover-or-focus", "tooltip")(exportedFunctions);
    Menu = findBy("getInitialFocusElement", "children")(exportedFunctions);
    MenuItem = findBy("handleMouseEnter", "onClick")(exportedFunctions);
    MenuItemSubMenu = findBy("subMenuIcon")(exportedFunctions);
    RemoteConfigProvider = ({ configuration = Platform.getRemoteConfiguration(), children = undefined })=>React.createElement(RemoteConfigProviderComponent, {
            configuration
        }, children);
    PanelHeader = exportedFunctions.find((m)=>m.toString().includes("panel") && m.toString().includes("actions"));
    PanelContent = exportedForwardRefs.find((f)=>f.render.toString().includes("fixedHeader"));
    PanelSkeleton = findBy("label", "aside")(exportedFunctions) || findBy((m)=>m.render.toString().includes("section"))(exportedForwardRefs);
    Snackbar = {
        wrapper: findBy("encore-light-theme", "elevated")(exportedFunctions),
        simpleLayout: findBy("leading", "center", "trailing")(exportedFunctions),
        ctaText: findBy("ctaText")(exportedFunctions),
        styledImage: findBy("placeholderSrc")(exportedFunctions)
    };
    FilterBox = exportedMemos.find((f)=>f.type.toString().includes("filterBoxApiRef"));
    ScrollableContainer = findBy("scrollLeft", "showButtons")(exportedFunctions);
    ScrollableText = findBy("scrollLeft", "pauseAtEndEdgeDurationMs")(exportedFunctions);
    Toggle = findBy("onSelected", 'type:"checkbox"')(exportedFunctions);
    Router = findBy("navigationType", "static")(exportedFunctions);
    Routes = findBy(/\([a-zA-Z_\$][\w\$]*\)\{let\{children:[a-zA-Z_\$][\w\$]*,location:[a-zA-Z_\$][\w\$]*\}=[a-zA-Z_\$][\w\$]*/)(exportedFunctions);
    Route = findBy(/^function [a-zA-Z_\$][\w\$]*\([a-zA-Z_\$][\w\$]*\)\{\(0,[a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*\)\(\!1\)\}$/)(exportedFunctions);
    StoreProvider = findBy("notifyNestedSubs", "serverState")(exportedFunctions);
    GenericModal = findBy("GenericModal")(exportedFunctions);
    Tracklist = exportedMemos.find((f)=>f.type.toString().includes("nrValidItems"));
    TracklistRow = exportedMemos.find((f)=>f.type.toString().includes("track-icon"));
    TracklistColumnsContextProvider = findBy("columnType")(exportedFunctions);
});
(CHUNKS["/xpui-desktop-routes-settings.js"] ??= Promise.withResolvers()).promise.then(()=>{
    const { exportedFunctions } = analyzeWebpackRequire(require);
    SettingColumn = findBy("setSectionFilterMatchQueryValue", "filterMatchQuery")(exportedFunctions);
    SettingText = findBy("textSubdued", "dangerouslySetInnerHTML")(exportedFunctions);
    SettingToggle = findBy("condensed", "onSelected")(exportedFunctions);
});
