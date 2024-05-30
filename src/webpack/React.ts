/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
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

webpackLoaded.subscribe(loaded => {
	if (!loaded) {
		return;
	}

	ReactJSX = modules.find(m => m.jsx)!;
	ReactDOM = modules.find(m => m.createRoot)!;
	ReactDOMServer = modules.find(m => m.renderToString)!;
});
