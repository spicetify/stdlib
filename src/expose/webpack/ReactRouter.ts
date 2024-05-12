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

import { chunks, require } from "./index.js";
import { findBy } from "/hooks/util.js";

export const [ReactRouterModuleID] = chunks.find(([_, v]) => v.toString().includes("React Router"))!;
export const ReactRouterModule = Object.values(require(ReactRouterModuleID));

// https://github.com/remix-run/react-router/blob/main/packages/react-router/lib/hooks.tsx#L131
export const useMatch = findBy(
   "let{pathname:",
   /\(([a-zA-Z_\$][\w\$]*),([a-zA-Z_\$][\w\$]*)\)\),\[\2,\1\]/,
)(ReactRouterModule);
