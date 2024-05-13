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

import { webpackLoaded } from "../../mixin";
import { modules } from "./index.js";

import type ReactDOMT from "react-dom";
import type ReactDOMServerT from "react-dom/server";
export type ReactDOM = typeof ReactDOMT;
export type ReactDOMServer = typeof ReactDOMServerT;

export let ReactJSX: any;
export let ReactDOM: ReactDOM;
export let ReactDOMServer: ReactDOMServer;

webpackLoaded.subscribe( loaded => {
   if ( !loaded ) {
      return;
   }

   ReactJSX = modules.find( m => m.jsx )!;
   ReactDOM = modules.find( m => m.createRoot )!;
   ReactDOMServer = modules.find( m => m.renderToString )!;
} );
