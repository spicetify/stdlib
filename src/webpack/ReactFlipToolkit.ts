/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { webpackLoaded } from "../../mixin.ts";
import { exportedFunctions } from "./index.ts";

import type { Flipped as FlippedT, Flipper as FlipperT } from "npm:react-flip-toolkit";

export type Flipped = typeof FlippedT;
export type Flipper = FlipperT;

export let Flipper: Flipper;
export let Flipped: Flipped;

webpackLoaded.subscribe(loaded => {
	if (!loaded) {
		return;
	}

	Flipper = exportedFunctions.find(m => m.prototype?.getSnapshotBeforeUpdate)!;
	Flipped = exportedFunctions.find(m => (m as any).displayName === "Flipped")!;
});
