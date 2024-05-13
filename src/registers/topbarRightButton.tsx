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

import { type Predicate, Registry } from "./registry.js";
import { React } from "../expose/React.js";
import { createIconComponent } from "../../lib/createIconComponent.js";
import { transformer } from "../../mixin.js";
import { isTouchscreenUi } from "../utils/index.js";
import { Tooltip } from "../webpack/ReactComponents.js";
import { UI } from "../webpack/ComponentLibrary.js";
import { classnames } from "../webpack/ClassNames.js";

const registry = new ( class extends Registry<React.FC, void> {
   override register( item: React.FC, predicate: Predicate<void> ): React.FC {
      super.register( item, predicate );
      refreshTopbarRightButtons?.();
      return item;
   }

   override unregister( item: React.FC ): React.FC {
      super.unregister( item );
      refreshTopbarRightButtons?.();
      return item;
   }
} )();
export default registry;

let refreshTopbarRightButtons: React.DispatchWithoutAction | undefined;

declare global {
   var __renderTopbarRightButtons: any;
}

let topbarRightButtonFactoryCtx: React.Context<React.FC<TopbarRightButtonProps>>;
globalThis.__renderTopbarRightButtons = () =>
   React.createElement( () => {
      const [ ___, refresh ] = React.useReducer( n => n + 1, 0 );
      refreshTopbarRightButtons = refresh;

      const topbarRightButtonFactory = isTouchscreenUi() ? TopbarRightButtonRound : TopbarRightButtonSquare;

      if ( !topbarRightButtonFactoryCtx )
         topbarRightButtonFactoryCtx = React.createContext<TopbarRightButtonFactory>( null! );

      return (
         <topbarRightButtonFactoryCtx.Provider value={ topbarRightButtonFactory }>
            { registry.getItems( undefined, true ).map( TopbarRightButton => (
               <TopbarRightButton />
            ) ) }
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
export const Button = ( props: TopbarRightButtonProps ) => {
   const TopbarRightButtonFactory = React.useContext( topbarRightButtonFactoryCtx );
   return TopbarRightButtonFactory && <TopbarRightButtonFactory { ...props } />;
};

type TopbarRightButtonFactory = React.FC<TopbarRightButtonProps>;

const TopbarRightButtonRound: TopbarRightButtonFactory = props => (
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
const TopbarRightButtonSquare: TopbarRightButtonFactory = props => (
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
