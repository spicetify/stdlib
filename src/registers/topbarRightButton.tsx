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
import { classnames } from "../webpack/ClassNames.js";
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
   var __renderTopbarRightButtons: any;
}

let topbarRightButtonFactoryCtx: React.Context<React.FC<TopbarRightButtonProps>>;
globalThis.__renderTopbarRightButtons = () =>
   React.createElement( () => {
      [ , refresh ] = React.useReducer( n => n + 1, 0 );

      const topbarRightButtonFactory = isTouchscreenUi() ? _TopbarRightButtonT : _TopbarRightButton;

      if ( !topbarRightButtonFactoryCtx )
         topbarRightButtonFactoryCtx = React.createContext<TopbarRightButtonFactory>( null! );

      return (
         <topbarRightButtonFactoryCtx.Provider value={ topbarRightButtonFactory }>
            { registry.all().reverse() }
         </topbarRightButtonFactoryCtx.Provider>
      );
   } );
transformer(
   emit => str => {
      str = str.replace( /("login-button"[^\}]*\}[^\}]*\}[^\}]*\}\))/, "$1,__renderTopbarRightButtons()" );
      emit();
      return str;
   },
   {
      glob: /^\/xpui\.js/,
   },
);

type TopbarRightButtonProps = { label: string; disabled?: boolean; onClick: () => void; icon?: string; };
export const TopbarRightButton = ( props: TopbarRightButtonProps ) => {
   const TopbarRightButtonFactory = React.useContext( topbarRightButtonFactoryCtx );
   return TopbarRightButtonFactory && <TopbarRightButtonFactory { ...props } />;
};

type TopbarRightButtonFactory = React.FC<TopbarRightButtonProps>;

const _TopbarRightButtonT: TopbarRightButtonFactory = props => (
   <Tooltip label={ props.label }>
      <UI.ButtonTertiary
         aria-label={ props.label }
         onClick={ props.onClick }
         size="small"
         condensedAll
         className={ CLASSMAP.main.topbar.right.button_t.wrapper }
      >
         { props.icon && createIconComponent( { icon: props.icon, iconSize: 16, realIconSize: 24 } ) }
      </UI.ButtonTertiary>
   </Tooltip>
);

const _TopbarRightButton: TopbarRightButtonFactory = props => (
   <Tooltip label={ props.label }>
      <button
         aria-label={ props.label }
         className={ classnames( "encore-over-media-set", CLASSMAP.main.topbar.right.button.wrapper ) }
         onClick={ props.onClick }
         disabled={ props.disabled }
      >
         { props.icon && createIconComponent( { icon: props.icon, iconSize: 16 } ) }
      </button>
   </Tooltip>
);
