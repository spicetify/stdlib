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

const [infiniteQueryChunkID] = chunks.find(
   ([_, v]) => v.toString().includes("fetchPreviousPage") && v.toString().includes("getOptimisticResult"),
)!;

export const QueryClient = findBy("defaultMutationOptions")(exportedFunctions) as unknown as QueryClient;
export const PersistQueryClientProvider = findBy("persistOptions")(exportedFunctions);
export const QueryClientProvider = findBy("use QueryClientProvider")(exportedFunctions) as QueryClientProvider;
export const notifyManager = modules.find(m => m.setBatchNotifyFunction) as notifyManager;
export const useMutation = findBy("mutateAsync")(exportedFunctions) as useMutation;
export const useQuery = findBy(
   /^function [a-zA-Z_\$][\w\$]*\(([a-zA-Z_\$][\w\$]*),([a-zA-Z_\$][\w\$]*)\)\{return\(0,[a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*\)\(\1,[a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*,\2\)\}$/,
)(exportedFunctions) as useQuery;
export const useQueryClient = findBy("client", "Provider", "mount")(exportedFunctions) as useQueryClient;
export const useSuspenseQuery = findBy(
   "throwOnError",
   "suspense",
   "enabled",
)(exportedFunctions) as useSuspenseQuery;
export const useInfiniteQuery = Object.values(require(infiniteQueryChunkID)).find(
   m => typeof m === "function",
) as useInfiniteQuery;
