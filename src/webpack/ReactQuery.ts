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
import { chunks, exportedFunctions, modules, require } from "./index.js";

import type {
   QueryClient as QueryClientT,
   QueryClientProvider as QueryClientProviderT,
   notifyManager as notifyManagerT,
   useMutation as useMutationT,
   useQuery as useQueryT,
   useQueryClient as useQueryClientT,
   useSuspenseQuery as useSuspenseQueryT,
   useInfiniteQuery as useInfiniteQueryT,
} from "@tanstack/react-query";
import { findBy } from "/hooks/util.js";

export type QueryClient = QueryClientT;
export type QueryClientProvider = typeof QueryClientProviderT;
export type notifyManager = typeof notifyManagerT;
export type useMutation = typeof useMutationT;
export type useQuery = typeof useQueryT;
export type useQueryClient = typeof useQueryClientT;
export type useSuspenseQuery = typeof useSuspenseQueryT;
export type useInfiniteQuery = typeof useInfiniteQueryT;


export let QueryClient: QueryClient;
export let PersistQueryClientProvider: Function;
export let QueryClientProvider: QueryClientProvider;
export let notifyManager: notifyManager;
export let useMutation: useMutation;
export let useQuery: useQuery;
export let useQueryClient: useQueryClient;
export let useSuspenseQuery: useSuspenseQuery;
export let useInfiniteQuery: useInfiniteQuery;


webpackLoaded.subscribe( loaded => {
   if ( !loaded ) {
      return;
   }

   QueryClient = findBy( "defaultMutationOptions" )( exportedFunctions ) as unknown as QueryClient;
   PersistQueryClientProvider = findBy( "persistOptions" )( exportedFunctions );
   QueryClientProvider = findBy( "use QueryClientProvider" )( exportedFunctions ) as QueryClientProvider;
   notifyManager = modules.find( m => m.setBatchNotifyFunction ) as notifyManager;
   useMutation = findBy( "mutateAsync" )( exportedFunctions ) as useMutation;
   useQuery = findBy(
      /^function [a-zA-Z_\$][\w\$]*\(([a-zA-Z_\$][\w\$]*),([a-zA-Z_\$][\w\$]*)\)\{return\(0,[a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*\)\(\1,[a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*,\2\)\}$/,
   )( exportedFunctions ) as useQuery;
   useQueryClient = findBy( "client", "Provider", "mount" )( exportedFunctions ) as useQueryClient;
   useSuspenseQuery = findBy(
      "throwOnError",
      "suspense",
      "enabled",
   )( exportedFunctions ) as useSuspenseQuery;
   const [ infiniteQueryChunkID ] = chunks.find(
      ( [ _, v ] ) => v.toString().includes( "fetchPreviousPage" ) && v.toString().includes( "getOptimisticResult" ),
   )!;
   useInfiniteQuery = Object.values( require( infiniteQueryChunkID ) ).find(
      m => typeof m === "function",
   ) as useInfiniteQuery;

} );
