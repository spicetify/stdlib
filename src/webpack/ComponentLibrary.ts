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
import { exportedForwardRefs, exportedFunctions, exports } from "./index.js";


export let UI: any;

webpackLoaded.subscribe( loaded => {
   if ( !loaded ) {
      return;
   }

   const componentNames = Object.keys( exports.find( e => e.BrowserDefaultFocusStyleProvider ) );
   const componentRegexes = componentNames.map(
      n => new RegExp( `"data-encore-id":(?:[a-zA-Z_\$][\w\$]*\\.){2}${ n }\\b` ),
   );
   const componentPairs = [
      exportedFunctions.map( f => [ f, f ] ),
      exportedForwardRefs.map( f => [ ( f as any ).render, f ] ),
   ]
      .flat()
      .map( ( [ s, f ] ) => [ componentNames.find( ( n, i ) => s.toString().match( componentRegexes[ i ] ) ), f ] );

   UI = Object.fromEntries( componentPairs );
} );
