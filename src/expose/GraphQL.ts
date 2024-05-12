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

export type GraphQLOp = "query" | "mutation";
export type GraphQLDef<N extends string, O extends GraphQLOp> = {
   name: N;
   operation: O;
   sha256Hash: string;
   value: null;
};
export type GraphQLDefs = { [O in GraphQLOp]: { [N in string]: GraphQLDef<N, O> } };

export const GraphQLDefs = {
   query: {},
   mutation: {},
} as GraphQLDefs;

transformer(
   emit => str => {
      const matches = str.matchAll(
         /(=new [a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*\("(?<name>\w+)","(?<operation>query|mutation)","(?<sha256Hash>[\w\d]{64})",null\))/g,
      );
      for (const match of matches) {
         const { name, operation, sha256Hash } = match.groups!;
         // @ts-ignore
         GraphQLDefs[operation][name] = { name, operation, sha256Hash, value: null };
      }
      emit();
      return str;
   },
   {
      glob: /.+\.js$/,
   },
);
