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
import { transformer } from "../../mixin.js";

const registry = new Registry<React.ReactElement, void>();
export default registry;

declare global {
   var __renderSettingSections: any;
}

globalThis.__renderSettingSections = registry.getItems.bind(registry);
transformer(
   emit => str => {
      str = str.replace(
         /(\(0,[a-zA-Z_\$][\w\$]*\.jsx\)\([a-zA-Z_\$][\w\$]*,{settings:[a-zA-Z_\$][\w\$]*,setValue:[a-zA-Z_\$][\w\$]*}\))]/,
         "$1,...__renderSettingSections()]",
      );

      emit();
      return str;
   },
   {
      noAwait: true,
      glob: /^\/xpui-routes-desktop-settings\.js/,
   },
);
