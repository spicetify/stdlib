/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

declare global {
	var webpackChunkclient_web: any;
}

import { webpackLoaded } from "../../mixin";

import type {
	NamedExoticComponent as NamedExoticComponentT,
	ForwardRefExoticComponent as ForwardRefExoticComponentT,
	Context as ContextT,
} from "react";

export type NamedExoticComponent = NamedExoticComponentT;
export type ForwardRefExoticComponent<P> = ForwardRefExoticComponentT<P>;
export type Context<T> = ContextT<T>;

type WebpackRequire = any;
type WebpackChunk = any;
type WebpackModule = any;

export let require: WebpackRequire;
export let chunks: Array<[string, WebpackChunk]>;
export let modules: Array<WebpackModule>;
export let exports: Array<any>;

export let exportedFunctions: Array<Function>;

export let exportedReactObjects: Partial<Record<any, any[]>>;
export let exportedContexts: Array<Context<any>>;
export let exportedForwardRefs: Array<ForwardRefExoticComponent<any>>;
export let exportedMemos: NamedExoticComponent[];

webpackLoaded.subscribe(loaded => {
	if (!loaded) {
		return;
	}

	require = globalThis.webpackChunkclient_web.push([[Symbol()], {}, (re: any) => re]);
	chunks = Object.entries(require.m);
	modules = chunks.map(([id]) => require(id));
	exports = modules
		.filter(module => typeof module === "object")
		.flatMap(module => {
			try {
				return Object.values(module);
			} catch (_) {}
		})
		.filter(Boolean);

	const isFunction = (obj: any): obj is Function => typeof obj === "function";
	exportedFunctions = exports.filter(isFunction);

	exportedReactObjects = Object.groupBy(exports, x => x.$$typeof);
	exportedContexts = exportedReactObjects[Symbol.for("react.context") as any]!;
	exportedForwardRefs = exportedReactObjects[Symbol.for("react.forward_ref") as any]!;
	exportedMemos = exportedReactObjects[Symbol.for("react.memo") as any]!;
});
