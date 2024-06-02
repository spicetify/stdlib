/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { webpackLoaded } from "../../mixin.ts";
import { modules } from "./index.ts";

import type MousetrapT from "npm:@types/mousetrap";
export type Mousetrap = typeof MousetrapT;

export let Mousetrap: Mousetrap;

webpackLoaded.subscribe(loaded => {
	if (!loaded) {
		return;
	}

	Mousetrap = modules.find(m => m.addKeycodes);
});
