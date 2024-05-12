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

import { Platform } from "../Platform.js";
import { exportedFunctions, exports } from "./index.js";
import { findBy } from "/hooks/util.js";

export const useContextMenuState = findBy("useContextMenuState")(exportedFunctions);

export const Color = Object.assign(findBy("static fromHex")(exportedFunctions)!, {
   CSSFormat: exports.find(m => m.RGBA)!,
});

export const _reservedPanelIds = exports.find(m => m.BuddyFeed) as Record<string, number>;
export const Locale = exports.find(m => m.getTranslations);
export const createUrlLocale = findBy("has", "baseName", "language")(exportedFunctions);

export const imageAnalysis = findBy(/\![a-zA-Z_\$][\w\$]*\.isFallback|\{extractColor/)(exportedFunctions);
export const fallbackPreset = exports.find(m => m.colorDark);

export const extractColorPreset = async (image: any) => {
   const analysis = await imageAnalysis(Platform.getGraphQLLoader(), image);
   for (const result of analysis) {
      if ("isFallback" in result === false) {
         result.isFallback = fallbackPreset === result; // Why ?
      }
   }

   return analysis;
};

export const getPlayContext = findBy("referrerIdentifier", "usePlayContextItem")(exportedFunctions);

export const InternalPropetyMap = exports.find(o => o.Builder);
