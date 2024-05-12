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

import type { PlatformAutoGen } from "/hooks/PlatformAutoGen.d.ts";

export type Platform = PlatformAutoGen;
export let Platform = null! as Platform;
export let Cosmos = null! as ReturnType<Platform["getPlayerAPI"]>["_cosmos"];

transformer<Platform>(
   emit => str => {
      str = str.replace(
         /(setTitlebarHeight[\w(){}.,&$!=;"" ]+)(\{version:[a-zA-Z_\$][\w\$]*,)/,
         "$1__Platform=$2",
      );
      Object.defineProperty(globalThis, "__Platform", {
         set: emit,
      });
      return str;
   },
   {
      then: ($: Platform) => {
         Platform = $;
         Cosmos = $.getPlayerAPI()._cosmos;
      },
      glob: /^\/xpui\.js/,
   },
);
