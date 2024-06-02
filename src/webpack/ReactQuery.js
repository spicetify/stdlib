/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
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
