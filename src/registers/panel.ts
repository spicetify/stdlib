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

import type { createMachine as createMachineT } from "xstate";
import { Registry, type Predicate } from "./registry.js";

export type StateMachine = ReturnType<typeof createMachineT>;
export let Machine: StateMachine;

const NodeNash = Symbol.for( "NodeHash" );

class R extends Registry<React.ReactNode, void> {
   override register( item: React.ReactNode, predicate: Predicate<void> ): React.ReactNode {
      super.register( item, predicate );
      const hash = crypto.randomUUID();
      // @ts-ignore
      item[ NodeNash ] = hash;

      const state = `bespoke_${ hash }`;
      const button_click = `bespoke_${ hash }_button_click`;

      stateToNode.set( state, hash );

      ON[ button_click ] = {
         target: state,
      };

      Machine.config.states![ state ] = {
         entry: [],
         on: Object.setPrototypeOf(
            {
               [ button_click ]: {
                  target: "disabled",
               },
            },
            ON,
         ),
      };
      return item;
   }

   override unregister( item: React.ReactNode ): React.ReactNode {
      super.unregister( item );
      // @ts-ignore
      const hash = item[ NodeNash ];
      stateToNode.delete( hash );
      const state = `bespoke_${ hash }`;
      const button_click = `bespoke_${ hash }_button_click`;

      stateToNode.delete( state );

      delete ON[ button_click ];
      return item;
   }
}

const registry = new R();
export default registry;

const stateToNode = new Map<string, React.ReactNode>();

declare global {
   var __renderPanel: any;
}

globalThis.__renderPanel = ( state: string ) => {
   if ( !state.startsWith( "bespoke" ) ) {
      return null;
   }

   return stateToNode.get( state );
};

let ON: Record<string, any>;

transformer(
   emit => str => {
      str = str.replace( /(=\(0,[a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*\)\(\{id:"RightPanelState)/, "=__Machine$1" );
      let __Machine: StateMachine;
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
      then: ( $: StateMachine ) => {
         Machine = $;

         ON = {
            ...Machine.config.states!.disabled.on,
            panel_close_click_or_collapse: [
               {
                  target: "disabled",
               },
            ],
         };
         delete ON.playback_autoplay_context_changed;

         for ( const [ k, v ] of Object.entries( Machine.config.states! ) ) {
            if ( k === "puffin_activation" ) {
               continue;
            }
            v.on = new Proxy( v.on!, {
               get( target, p, receiver ) {
                  // @ts-ignore
                  if ( p.startsWith( "bespoke" ) ) {
                     // @ts-ignore
                     return ON[ p ];
                  }
                  // @ts-ignore
                  return target[ p ];
               },
            } );
         }
      },
      glob: /^\/xpui\.js/,
      noAwait: true,
   },
);
