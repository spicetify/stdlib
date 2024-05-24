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

import { React } from "../expose/React.js";
import { createIconComponent } from "../../lib/createIconComponent.js";
import { transformer } from "../../mixin.js";
import { isTouchscreenUi } from "../utils/index.js";
import { Tooltip } from "../webpack/ReactComponents.js";
import { UI } from "../webpack/ComponentLibrary.js";
import { Registry } from "./registry.js";

const registry = new ( class extends Registry<React.ReactNode> {
   override add( value: React.ReactNode ): this {
      refresh?.();
      return super.add( value );
   }

   override delete( value: React.ReactNode ): boolean {
      refresh?.();
      return super.delete( value );
   }
} );
export default registry;

let refresh: React.DispatchWithoutAction | undefined;

declare global {
   var __renderTopbarLeftButtons: any;
}

let topbarLeftButtonFactoryCtx: React.Context<TopbarLeftButtonFactory>;
globalThis.__renderTopbarLeftButtons = () =>
   React.createElement( () => {
      [ , refresh ] = React.useReducer( n => n + 1, 0 );

      const topbarLeftButtonFactory = isTouchscreenUi() ? _TopbarLeftButtonT : _TopbarLeftButton;

      if ( !topbarLeftButtonFactoryCtx )
         topbarLeftButtonFactoryCtx = React.createContext<TopbarLeftButtonFactory>( null! );

      return (
         <topbarLeftButtonFactoryCtx.Provider value={ topbarLeftButtonFactory }>
            { registry.all() }
         </topbarLeftButtonFactoryCtx.Provider>
      );
   } );
transformer(
   emit => str => {
      str = str.replace( /("top-bar-forward-button"[^\]]*)/g, "$1,__renderTopbarLeftButtons()" );
      emit();
      return str;
   },
   {
      glob: /^\/xpui\.js/,
   },
);

type TopbarLeftButtonProps = { label: string; disabled?: boolean; onClick: () => void; icon?: string; };
export const TopbarLeftButton = ( props: TopbarLeftButtonProps ) => {
   const TopbarLeftButtonFactory = React.useContext( topbarLeftButtonFactoryCtx );
   return TopbarLeftButtonFactory && <TopbarLeftButtonFactory { ...props } />;
};

type TopbarLeftButtonFactory = React.FC<TopbarLeftButtonProps>;

const _TopbarLeftButtonT: TopbarLeftButtonFactory = props => (
   <Tooltip label={ props.label }>
      <UI.ButtonTertiary
         size="medium"
         iconOnly={ () =>
            props.icon && createIconComponent( { icon: props.icon, iconSize: 16, realIconSize: 24 } )
         }
         condensed
         aria-label={ props.label }
         disabled={ props.disabled }
         onClick={ props.onClick }
         className={ CLASSMAP.main.topbar.left.button_t.wrapper }
      />
   </Tooltip>
);

const _TopbarLeftButton: TopbarLeftButtonFactory = props => (
   <Tooltip label={ props.label }>
      <button
         aria-label={ props.label }
         disabled={ props.disabled }
         className={ CLASSMAP.main.topbar.left.button.wrapper }
         onClick={ props.onClick }
      >
         { props.icon &&
            createIconComponent( {
               icon: props.icon,
               iconSize: 16,
               className: CLASSMAP.main.topbar.left.button.icon.wrapper,
            } ) }
      </button>
   </Tooltip>
);
