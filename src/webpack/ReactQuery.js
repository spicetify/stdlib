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
 */ import { webpackLoaded } from "../../mixin.js";
import { chunks, exportedFunctions, modules, require } from "./index.js";
import { findBy } from "/hooks/util.js";
export let QueryClient;
export let PersistQueryClientProvider;
export let QueryClientProvider;
export let notifyManager;
export let useMutation;
export let useQuery;
export let useQueryClient;
export let useSuspenseQuery;
export let useInfiniteQuery;
webpackLoaded.subscribe((loaded)=>{
    if (!loaded) {
        return;
    }
    QueryClient = findBy("defaultMutationOptions")(exportedFunctions);
    PersistQueryClientProvider = findBy("persistOptions")(exportedFunctions);
    QueryClientProvider = findBy("use QueryClientProvider")(exportedFunctions);
    notifyManager = modules.find((m)=>m.setBatchNotifyFunction);
    useMutation = findBy("mutateAsync")(exportedFunctions);
    useQuery = findBy(/^function [a-zA-Z_\$][\w\$]*\(([a-zA-Z_\$][\w\$]*),([a-zA-Z_\$][\w\$]*)\)\{return\(0,[a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*\)\(\1,[a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*,\2\)\}$/)(exportedFunctions);
    useQueryClient = findBy("client", "Provider", "mount")(exportedFunctions);
    useSuspenseQuery = findBy("throwOnError", "suspense", "enabled")(exportedFunctions);
    const [infiniteQueryChunkID] = chunks.find(([_, v])=>v.toString().includes("fetchPreviousPage") && v.toString().includes("getOptimisticResult"));
    useInfiniteQuery = Object.values(require(infiniteQueryChunkID)).find((m)=>typeof m === "function");
});
