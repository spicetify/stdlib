/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { webpackLoaded } from "../../mixin";
import { modules } from "./index.js";

import type MousetrapT from "mousetrap";
export type Mousetrap = typeof MousetrapT;

export let Mousetrap: Mousetrap;

webpackLoaded.subscribe(loaded => {
	if (!loaded) {
		return;
	}

	Mousetrap = modules.find(m => m.addKeycodes);
});
