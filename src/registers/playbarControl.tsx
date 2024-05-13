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

import { Registry } from "./registry.js";
import { React } from "../expose/React.js";
import { createIconComponent } from "../../lib/createIconComponent.js";
import { transformer } from "../../mixin.js";
import { Tooltip } from "../webpack/ReactComponents.js";
import { UI } from "../webpack/ComponentLibrary.js";
import { classnames } from "../webpack/ClassNames.js";

const registry = new Registry<React.ReactNode, void>();
export default registry;

declare global {
   var __renderPlaybarBarControls: any;
}

globalThis.__renderPlaybarBarControls = registry.getItems.bind( registry, undefined, true );
transformer(
   emit => str => {
      str = str.replace( /(children:\[)([^\[]*djJumpButtonFactory)/, "$1...__renderPlaybarBarControls(),$2" );
      emit();
      return str;
   },
   {
      glob: /^\/xpui\.js/,
   },
);

export type PlaybarBarControlProps = {
   label: string;
   isActive?: boolean;
   isActiveNoIndicator?: boolean;
   disabled?: boolean;
   icon?: string;
   onClick: () => void;
};
export const PlaybarBarControl = ( {
   label,
   isActive = false,
   isActiveNoIndicator = false,
   disabled = false,
   icon,
   onClick,
}: PlaybarBarControlProps ) => {
   const [ _isActive, _setIsActive ] = React.useState( isActive );

   return (
      <Tooltip label={ label }>
         <UI.ButtonTertiary
            aria-label={ label }
            size="small"
            className={ classnames( CLASSMAP.main.playbar.buttons.button.wrapper, {
               [ CLASSMAP.main.playbar.buttons.button.wrapper__indicator ]: _isActive,
               [ CLASSMAP.main.playbar.buttons.button.wrapper__active ]: _isActive || isActiveNoIndicator,
            } ) }
            disabled={ disabled }
            iconOnly={ icon && ( () => createIconComponent( { icon } ) ) }
            onClick={ () => {
               onClick();
               _setIsActive( !_isActive );
            } }
            data-active={ _isActive.toString() }
            aria-pressed={ _isActive }
         />
      </Tooltip>
   );
};
