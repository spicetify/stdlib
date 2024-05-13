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
 */

import { webpackLoaded } from "../../mixin";
import { capitalize } from "../../deps";
import { Platform } from "../expose/Platform";
import { chunks, exportedForwardRefs, exportedFunctions, exportedMemos, modules, require } from "./index.js";
import { findBy } from "/hooks/util.js";
import { React } from "../expose/React";

import type { SnackbarProvider as SnackbarProviderT } from "notistack";
export type SnackbarProvider = SnackbarProviderT;

export let Menus: any;
export let Cards: any;
export let RemoteConfigProviderComponent: React.FC<any>;
export let Slider: React.FC<any>;
export let Nav: React.NamedExoticComponent;
export let NavTo: React.NamedExoticComponent;
export let InstrumentedRedirect: any;
export let SnackbarProvider: SnackbarProvider;
export let SettingColumn: Function;
export let SettingText: Function;
export let SettingToggle: Function;

export let ContextMenu: any;
export let RightClickMenu: Function;

export let ConfirmDialog: Function;
export let Tooltip: Function;

export let Menu: Function;
export let MenuItem: Function;
export let MenuItemSubMenu: Function;

export let RemoteConfigProvider: ( { configuration, children, }: {
   configuration?: {
      accessListeners: Set<any>;
      getValue: () => any;
      toBuilder: () => any;
      toJSON: () => any;
      values: Map<any, any>;
   } | undefined;
   children?: any;
} ) => React.FunctionComponentElement<any>;
export let PanelHeader: Function;
export let PanelContent: React.ForwardRefExoticComponent<any>;
export let PanelSkeleton: Function;

export let Snackbar: {
   wrapper: Function;
   simpleLayout: Function;
   ctaText: Function;
   styledImage: Function;
};
export let FilterBox: React.NamedExoticComponent;
export let ScrollableContainer: React.FC<any>;
export let ScrollableText: React.FC<any>;
export let Toggle: Function;
export let Router: Function;
export let Routes: Function;
export let Route: Function;
export let StoreProvider: Function;

export let GenericModal: Function;

export let Tracklist: React.NamedExoticComponent;
export let TracklistRow: React.NamedExoticComponent;
export let TracklistColumnsContextProvider: Function;

webpackLoaded.subscribe( loaded => {
   if ( !loaded ) {
      return;
   }

   Menus = Object.fromEntries(
      exportedMemos.flatMap( m => {
         const str = ( m as any ).type.toString() as string;
         const match = str.match( /value:"([\w-]+)"/ );
         const name = match?.[ 1 ] ?? "";
         // @ts-ignore
         const type = MenuTypes[ name ];
         return type ? [ [ type, m ] ] : [];
      } ),
   );

   const [ ContextMenuModuleID ] = chunks.find( ( [ _, v ] ) => v.toString().includes( "toggleContextMenu" ) )!;
   const [ playlistMenuChunkID ] = chunks.find(
      ( [ , v ] ) =>
         v.toString().includes( 'value:"playlist"' ) &&
         v.toString().includes( "canView" ) &&
         v.toString().includes( "permissions" ),
   )!;

   Menus.Playlist = Object.values( require( playlistMenuChunkID ) ).find(
      m => typeof m === "function" || typeof m === "object",
   );

   Cards = Object.assign(
      {
         Generic: findBy( "cardPlayButtonFactory", "featureIdentifier", "variant" )( exportedFunctions ),
         HeroGeneric: findBy(
            "cardPlayButtonFactory",
            "featureIdentifier",
            "getSignifierContent",
         )( exportedFunctions ),
         CardImage: findBy( '"card-image"' )( exportedFunctions ),
      },
      Object.fromEntries(
         [
            exportedFunctions.map( m => {
               try {
                  const str = m.toString();
                  const match = str.match( /featureIdentifier:"(.+?)"/ );
                  if ( !match ) return [];
                  const name = match[ 1 ];
                  return [ [ capitalize( name ), m ] ];
               } catch ( e ) {
                  return [];
               }
            } ),
            exportedMemos.map( m => {
               try {
                  const str = ( m as any ).type.toString();
                  const match = str.match( /featureIdentifier:"(.+?)"/ );
                  if ( !match ) return [];
                  const name = match[ 1 ];
                  return [ [ capitalize( name ), m ] ];
               } catch ( e ) {
                  return [];
               }
            } ),
         ].flat( 2 ),
      ),
   );

   RemoteConfigProviderComponent = findBy(
      "resolveSuspense",
      "configuration",
   )( exportedFunctions );

   Slider = exportedFunctions.find(
      m => m.toString().includes( "onStepBackward" ) && !m.toString().includes( "volume" ),
   );

   const exportedMemoFRefs = exportedMemos.filter(
      m => ( m as any ).type.$$typeof === Symbol.for( "react.forward_ref" ),
   );
   Nav = exportedMemoFRefs.find( m => ( m as any ).type.render.toString().includes( "navigationalRoot" ) )!;
   NavTo = exportedMemoFRefs.find( m => ( m as any ).type.render.toString().includes( "pageId" ) )!;

   InstrumentedRedirect = modules.find( e => e.InstrumentedRedirect );

   SnackbarProvider = findBy( "enqueueSnackbar called with invalid argument" )(
      exportedFunctions,
   ) as unknown as SnackbarProvider;

   SettingColumn = findBy( "setSectionFilterMatchQueryValue", "filterMatchQuery" )( exportedFunctions );
   SettingText = findBy( "textSubdued", "dangerouslySetInnerHTML" )( exportedFunctions );
   SettingToggle = findBy( "condensed", "onSelected" )( exportedFunctions );

   ContextMenu = Object.values( require( ContextMenuModuleID ) )[ 0 ];
   RightClickMenu = findBy( "action", "open", "trigger", "right-click" )( exportedFunctions );

   ConfirmDialog = findBy( "isOpen", "shouldCloseOnEsc", "onClose" )( exportedFunctions );
   Tooltip = findBy( "hover-or-focus", "tooltip" )( exportedFunctions );

   Menu = findBy( "getInitialFocusElement", "children" )( exportedFunctions );
   MenuItem = findBy( "handleMouseEnter", "onClick" )( exportedFunctions );
   MenuItemSubMenu = findBy( "subMenuIcon" )( exportedFunctions );

   RemoteConfigProvider = ( {
      configuration = Platform.getRemoteConfiguration(),
      children = undefined as any,
   } ) => React.createElement( RemoteConfigProviderComponent, { configuration }, children );

   PanelHeader = exportedFunctions.find(
      m => m.toString().includes( "panel" ) && m.toString().includes( "actions" ),
   )!;
   PanelContent =
      findBy( m => m.render.toString().includes( "scrollBarContainer" ) )( exportedForwardRefs ) ||
      findBy( "scrollBarContainer" )( exportedFunctions );
   PanelSkeleton =
      findBy( "label", "aside" )( exportedFunctions ) ||
      findBy( m => m.render.toString().includes( "section" ) )( exportedForwardRefs );

   Snackbar = {
      wrapper: findBy( "encore-light-theme", "elevated" )( exportedFunctions ),
      simpleLayout: findBy( "leading", "center", "trailing" )( exportedFunctions ),
      ctaText: findBy( "ctaText" )( exportedFunctions ),
      styledImage: findBy( "placeholderSrc" )( exportedFunctions ),
   };

   FilterBox = exportedMemos.find( f => ( f as any ).type.toString().includes( "filterBoxApiRef" ) )!;
   ScrollableContainer = findBy( "scrollLeft", "showButtons" )( exportedFunctions );
   ScrollableText = findBy(
      "scrollLeft",
      "pauseAtEndEdgeDurationMs",
   )( exportedFunctions );
   Toggle = findBy( "onSelected", 'type:"checkbox"' )( exportedFunctions );
   Router = findBy( "navigationType", "static" )( exportedFunctions );
   Routes = findBy(
      /\([a-zA-Z_\$][\w\$]*\)\{let\{children:[a-zA-Z_\$][\w\$]*,location:[a-zA-Z_\$][\w\$]*\}=[a-zA-Z_\$][\w\$]*/,
   )( exportedFunctions );
   Route = findBy(
      /^function [a-zA-Z_\$][\w\$]*\([a-zA-Z_\$][\w\$]*\)\{\(0,[a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*\)\(\!1\)\}$/,
   )( exportedFunctions );
   StoreProvider = findBy( "notifyNestedSubs", "serverState" )( exportedFunctions );

   GenericModal = findBy( "GenericModal" )( exportedFunctions );

   Tracklist = exportedMemos.find( f => ( f as any ).type.toString().includes( "nrValidItems" ) )!;
   TracklistRow = exportedMemos.find( f => ( f as any ).type.toString().includes( "track-icon" ) )!;
   TracklistColumnsContextProvider = findBy( "columnType" )( exportedFunctions );
} );
