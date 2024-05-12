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

import type { Store } from "redux";

export type ReduxStore = Store;
export let ReduxStore = null! as ReduxStore;

transformer<ReduxStore>(
   emit => str => {
      str = str.replace(
         /(,[a-zA-Z_\$][\w\$]*=)(([$\w,.:=;(){}]+\(\{session:[a-zA-Z_\$][\w\$]*,features:[a-zA-Z_\$][\w\$]*,seoExperiment:[a-zA-Z_\$][\w\$]*\}))/,
         "$1__ReduxStore=$2",
      );
      Object.defineProperty(globalThis, "__ReduxStore", {
         set: emit,
      });
      return str;
   },
   {
      then: ($: ReduxStore) => {
         ReduxStore = $;
      },
      glob: /^\/xpui\.js/,
   },
);
