/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { webpackLoaded } from "../../mixin.ts";
import { modules } from "./index.ts";

import type ReactDOMT from "npm:@types/react-dom";
import type ReactDOMServerT from "npm:@types/react-dom/server";
export type ReactDOM = typeof ReactDOMT;
export type ReactDOMServer = typeof ReactDOMServerT;

export let ReactJSX: any;
export let ReactDOM: ReactDOM;
export let ReactDOMServer: ReactDOMServer;

webpackLoaded.subscribe(loaded => {
	if (!loaded) {
		return;
	}

	ReactJSX = modules.find(m => m.jsx)!;
	ReactDOM = modules.find(m => m.createRoot)!;
	ReactDOMServer = modules.find(m => m.renderToString)!;
});
