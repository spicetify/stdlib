import { transformer } from "../../mixin.js";

import type { createMachine as createMachineT } from "xstate";
import { Registry } from "./registry.js";

export type StateMachine = ReturnType<typeof createMachineT>;
export let Machine: StateMachine;

const registry = new Map<string, React.ReactNode>();
export default registry;

declare global {
   var __renderPanel: any;
}

globalThis.__renderPanel = ( state: string ) => {
   if ( !state.startsWith( "bespoke" ) ) {
      return null;
   }

   return registry.get( state );
};

let ON;

transformer(
   emit => str => {
      str = str.replace( /(=\(0,[a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*\)\(\{id:"RightPanelState)/, "=$1" );
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

export const XYZ = ( state: string, node: React.ReactNode ) => {
   const module_state = `bespoke_${ state }`;
   const module_button_click = `bespoke_${ state }_button_click`;

   registry.set( state, node );

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

export const ABC = ( state: string ) => {
   const module_state = `bespoke_${ state }`;
   const module_button_click = `bespoke_${ state }_button_click`;

   registry.delete( state );

   delete ON[ module_button_click ];
};
