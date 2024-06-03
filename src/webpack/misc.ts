/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { webpackLoaded } from "../../mixin.ts";
import { exportedFunctions, exports } from "./index.ts";
import { findBy } from "/hooks/util.ts";

export let Color: Function & {
	Format: any;
};

export let Locale: any;
export let createUrlLocale: Function;

export let InternalPropetyMap: any;

webpackLoaded.subscribe(loaded => {
	if (!loaded) {
		return;
	}

	Color = Object.assign(findBy("this.rgb")(exportedFunctions)!, {
		Format: exports.find(m => m.RGBA)!,
	});

	Locale = exports.find(m => m.getTranslations);
	createUrlLocale = findBy("has", "baseName", "language")(exportedFunctions);

	InternalPropetyMap = exports.find(o => o.Builder);
});
