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
import { Platform } from "../expose/Platform";
import { exportedFunctions, exports } from "./index.js";
import { findBy } from "/hooks/util.js";

export let useContextMenuState: Function;

export let Color: Function & {
   CSSFormat: any;
};

export let _reservedPanelIds: Record<string, number>;
export let Locale: any;
export let createUrlLocale: Function;

export let imageAnalysis: Function;
export let fallbackPreset: any;

export let extractColorPreset = async ( image: any ) => {
   const analysis = await imageAnalysis( Platform.getGraphQLLoader(), image );
   for ( const result of analysis ) {
      if ( "isFallback" in result === false ) {
         result.isFallback = fallbackPreset === result; // Why ?
      }
   }

   return analysis;
};
export let getPlayContext: Function;

export let InternalPropetyMap: any;


webpackLoaded.subscribe( loaded => {
   if ( !loaded ) {
      return;
   }

   useContextMenuState = findBy( "useContextMenuState" )( exportedFunctions );

   Color = Object.assign( findBy( "static fromHex" )( exportedFunctions )!, {
      CSSFormat: exports.find( m => m.RGBA )!,
   } );

   _reservedPanelIds = exports.find( m => m.BuddyFeed );
   Locale = exports.find( m => m.getTranslations );
   createUrlLocale = findBy( "has", "baseName", "language" )( exportedFunctions );

   imageAnalysis = findBy( /\![a-zA-Z_\$][\w\$]*\.isFallback|\{extractColor/ )( exportedFunctions );
   fallbackPreset = exports.find( m => m.colorDark );

   getPlayContext = findBy( "referrerIdentifier", "usePlayContextItem" )( exportedFunctions );

   InternalPropetyMap = exports.find( o => o.Builder );
} );
