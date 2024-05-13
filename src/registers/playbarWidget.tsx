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

const registry = new Registry<React.ReactNode, void>();
export default registry;

declare global {
   var __renderNowPlayingWidgets: any;
}

globalThis.__renderNowPlayingWidgets = registry.getItems.bind( registry );
transformer(
   emit => str => {
      str = str.replace( /(hideButtonFactory[^\]]*)/, "$1,...__renderNowPlayingWidgets()" );
      emit();
      return str;
   },
   {
      glob: /^\/xpui\.js/,
   },
);

export type NowPlayingWidgetProps = { label: string; icon?: string; onClick: () => void; };
export const NowPlayingWidget = ( { label, icon, onClick }: NowPlayingWidgetProps ) => (
   <Tooltip label={ label }>
      <UI.ButtonTertiary
         size="small"
         className={ undefined }
         aria-label={ label }
         condensed={ false }
         iconOnly={ icon && ( () => createIconComponent( { icon } ) ) }
         onClick={ onClick }
      />
   </Tooltip>
);
