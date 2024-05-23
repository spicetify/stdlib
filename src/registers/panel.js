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

import { transformer } from "../../mixin.js";

export let Machine;

const registry = new Map();
export default registry;


globalThis.__renderPanel = ( state ) => {
   if ( !state.startsWith( "bespoke" ) ) {
      return null;
   }

   return registry.get( state );
};

let ON;

transformer(
   emit => str => {
      str = str.replace( /(=\(0,[a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*\)\(\{id:"RightPanelState)/, "=__Machine$1" );
      let __Machine;
      Object.defineProperty( globalThis, "__Machine", {
         set: value => {
            emit( value );
            __Machine = value;
         },
         get: () => __Machine,
      } );

      // ! HACKY ALERT
      str = str.replace(
         /(case [a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*\.Disabled:return!0;default:)/,
         "$1return true;",
      );

      str = str.replace(
         /(\(([a-zA-Z_\$][\w\$]*),"PanelSection".+?children:[a-zA-Z_\$][\w\$]*)/,
         "$1??__renderPanel($2)",
      );

      return str;
   },
   {
      then: ( $ ) => {
         Machine = $;

         ON = {
            ...Machine.config.states.disabled.on,
            panel_close_click_or_collapse: [
               {
                  target: "disabled",
               },
            ],
         };
         delete ON.playback_autoplay_context_changed;

         for ( const [ k, v ] of Object.entries( Machine.config.states ) ) {
            if ( k === "puffin_activation" ) {
               continue;
            }
            v.on = new Proxy( v.on, {
               get( target, p, receiver ) {
                  if ( p.startsWith( "bespoke" ) ) {
                     return ON[ p ];
                  }
                  return target[ p ];
               },
            } );
         }
      },
      glob: /^\/xpui\.js/,
      noAwait: true,
   },
);

export const XYZ = ( state, node ) => {
   const module_state = `bespoke_${ state }`;
   const module_button_click = `bespoke_${ state }_button_click`;

   registry.set( module_state, node );

   ON[ module_button_click ] = {
      target: module_state,
   };

   Machine.config.states[ module_state ] = {
      entry: [],
      on: Object.setPrototypeOf(
         {
            [ module_button_click ]: {
               target: "disabled",
            },
         },
         ON,
      ),
   };
};

export const ABC = ( state ) => {
   const module_state = `bespoke_${ state }`;
   const module_button_click = `bespoke_${ state }_button_click`;

   registry.delete( module_state );

   delete ON[ module_button_click ];
};
