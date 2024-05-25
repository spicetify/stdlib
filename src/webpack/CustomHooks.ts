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
import { Platform } from "../expose/Platform.js";
import { exportedFunctions, exports } from "./index.js";
import { findBy } from "/hooks/util.js";

export let DragHandler: Function;
export let useExtractedColor: Function;
export let usePanelAPI: Function;

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

export let useContextMenuState: Function;

export let useLocation: Function;


webpackLoaded.subscribe( loaded => {
   if ( !loaded ) {
      return;
   }

   DragHandler = findBy( "dataTransfer", "data-dragging" )( exportedFunctions );
   useExtractedColor = exportedFunctions.find(
      m =>
         m.toString().includes( "extracted-color" ) ||
         ( m.toString().includes( "colorRaw" ) && m.toString().includes( "useEffect" ) ),
   )!;
   usePanelAPI = findBy( "panelSend", "context" )( exportedFunctions );

   useContextMenuState = findBy( "useContextMenuState" )( exportedFunctions );

   imageAnalysis = findBy( /\![a-zA-Z_\$][\w\$]*\.isFallback|\{extractColor/ )( exportedFunctions );
   fallbackPreset = exports.find( m => m.colorDark );

   getPlayContext = findBy( "referrerIdentifier", "usePlayContextItem" )( exportedFunctions );

   useLocation = findBy( "location", "useContext" )( exportedFunctions );
} );
