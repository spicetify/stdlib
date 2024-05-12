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

declare global {
   var webpackChunkclient_web: any;
}

import type {
   NamedExoticComponent as NamedExoticComponentT,
   ForwardRefExoticComponent as ForwardRefExoticComponentT,
   Context as ContextT,
} from "react";

export type NamedExoticComponent = NamedExoticComponentT;
export type ForwardRefExoticComponent<P> = ForwardRefExoticComponentT<P>;
export type Context<T> = ContextT<T>;

type WebpackRequire = any;

export const require = globalThis.webpackChunkclient_web.push([
   [Symbol()],
   {},
   (re: any) => re,
]) as WebpackRequire;
export const chunks = Object.entries(require.m) as Array<[string, any]>;
export const modules = chunks.map(([id]) => require(id));
export const exports = modules
   .filter(module => typeof module === "object")
   .flatMap(module => {
      try {
         return Object.values(module);
      } catch (_) {}
   })
   .filter(Boolean) as any[];

// biome-ignore lint/complexity/noBannedTypes: ffs
const isFunction = (obj: any): obj is Function => typeof obj === "function";
export const exportedFunctions = exports.filter(isFunction);

export const exportedReactObjects = Object.groupBy(exports, x => x.$$typeof);
export const exportedContexts = exportedReactObjects[Symbol.for("react.context") as any] as Array<Context<any>>;
export const exportedForwardRefs = exportedReactObjects[Symbol.for("react.forward_ref") as any] as Array<
   ForwardRefExoticComponent<any>
>;
export const exportedMemos = exportedReactObjects[
   Symbol.for("react.memo") as any
] as Array<NamedExoticComponent>;
