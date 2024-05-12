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
import { Tooltip } from "../expose/webpack/ReactComponents.js";
import { UI } from "../expose/webpack/ComponentLibrary.js";

const registry = new (class extends Registry<React.FC, void> {
   override register(item: React.FC, predicate: Predicate<void>): React.FC {
      super.register(item, predicate);
      refreshTopbarLeftButtons?.();
      return item;
   }

   override unregister(item: React.FC): React.FC {
      super.unregister(item);
      refreshTopbarLeftButtons?.();
      return item;
   }
})();
export default registry;

let refreshTopbarLeftButtons: React.DispatchWithoutAction | undefined;

declare global {
   var __renderTopbarLeftButtons: any;
}

let topbarLeftButtonFactoryCtx: React.Context<TopbarLeftButtonFactory>;
globalThis.__renderTopbarLeftButtons = () =>
   React.createElement(() => {
      const [___, refresh] = React.useReducer(n => n + 1, 0);
      refreshTopbarLeftButtons = refresh;

      const topbarLeftButtonFactory = isTouchscreenUi() ? TopbarLeftButtonRound : TopbarLeftButtonSquare;

      if (!topbarLeftButtonFactoryCtx)
         topbarLeftButtonFactoryCtx = React.createContext<TopbarLeftButtonFactory>(null!);

      return (
         <topbarLeftButtonFactoryCtx.Provider value={topbarLeftButtonFactory}>
            {registry.getItems().map(TopbarLeftButton => (
               <TopbarLeftButton />
            ))}
         </topbarLeftButtonFactoryCtx.Provider>
      );
   });
transformer(
   emit => str => {
      str = str.replace(/("top-bar-forward-button"[^\]]*)/g, "$1,__renderTopbarLeftButtons()");
      emit();
      return str;
   },
   {
      glob: /^\/xpui\.js/,
   },
);

type TopbarLeftButtonProps = { label: string; disabled?: boolean; onClick: () => void; icon?: string };
export const Button = (props: TopbarLeftButtonProps) => {
   const TopbarLeftButtonFactory = React.useContext(topbarLeftButtonFactoryCtx);
   return TopbarLeftButtonFactory && <TopbarLeftButtonFactory {...props} />;
};

type TopbarLeftButtonFactory = React.FC<TopbarLeftButtonProps>;

const TopbarLeftButtonRound: TopbarLeftButtonFactory = props => (
   <Tooltip label={props.label}>
      <UI.ButtonTertiary
         size="medium"
         iconOnly={() =>
            props.icon && createIconComponent({ icon: props.icon, iconSize: 16, realIconSize: 24 })
         }
         condensed
         aria-label={props.label}
         disabled={props.disabled}
         onClick={props.onClick}
         className={CLASSMAP.main.topbar.left.button_t.wrapper}
      />
   </Tooltip>
);

const TopbarLeftButtonSquare: TopbarLeftButtonFactory = props => (
   <Tooltip label={props.label}>
      <button
         aria-label={props.label}
         disabled={props.disabled}
         className={CLASSMAP.main.topbar.left.button.wrapper}
         onClick={props.onClick}
      >
         {props.icon &&
            createIconComponent({
               icon: props.icon,
               iconSize: 16,
               className: CLASSMAP.main.topbar.left.button.icon.wrapper,
            })}
      </button>
   </Tooltip>
);
