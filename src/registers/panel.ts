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
import { Registry } from "./registry.js";

export type StateMachine = ReturnType<typeof createMachineT>;
export let Machine: StateMachine;

const registry = new ( class extends Registry<React.ReactNode> {
   private static NodeNash = Symbol.for( "NodeHash" );

   getHash( value: React.ReactNode ) {
      if ( !this.has( value ) ) {
         return null;
      }
      // @ts-ignore
      const hash = value[ this.constructor.NodeNash ];
      const state = `bespoke_${ hash }`;
      const event = `bespoke_${ hash }_button_click`;
      return { state, event };
   }

   override add( value: React.ReactNode, onEntry?: any, onExit?: any ): this {
      const hash = crypto.randomUUID();
      // @ts-ignore
      value[ this.constructor.NodeNash ] = hash;
      const state = `bespoke_${ hash }`;
      const event = `bespoke_${ hash }_button_click`;

      stateToNode.set( state, value );

      ON[ event ] = {
         target: state,
      };

      STATES[ state ] = {
         on: Object.setPrototypeOf(
            {
               [ event ]: {
                  target: "disabled",
               },
            },
            ON,
         ),
      };

      if ( onEntry ) {
         const entry = `bespoke_${ hash }_entry`;
         STATES[ state ].entry = [ entry ];
         ACTIONS[ entry ] = onEntry;
      }
      if ( onExit ) {
         const exit = `bespoke_${ hash }_exit`;
         Machine.config.states![ state ].exit = [ exit ];
         ACTIONS[ exit ] = onExit;
      }

      return super.add( value );
   }

   override delete( item: React.ReactNode ): boolean {
      // @ts-ignore
      const hash = item[ this.constructor.NodeNash ];
      const state = `bespoke_${ hash }`;
      const event = `bespoke_${ hash }_button_click`;

      stateToNode.delete( state );

      delete ON[ event ];
      return super.delete( item );
   }
} );
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

let ON: Record<string, any> = {};
let STATES: Record<string, any> = {};
let ACTIONS: Record<string, any> = {};

transformer(
   emit => str => {
      str = str.replace( /(=\(0,[a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*\)\(\{id:"RightPanelState)/, "=__Machine$1" );
      Object.defineProperty( globalThis, "__Machine", {
         set: ( $: StateMachine ) => {
            Machine = $;

            ON = {
               ...ON,
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

            Object.setPrototypeOf( Machine.config.states!, STATES );

            Machine._options.actions = ACTIONS;
         },
         get: () => Machine,
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

      emit();
      return str;
   },
   {
      glob: /^\/xpui\.js/,
   },
);
