/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { webpackLoaded } from "../../mixin.ts";
import { exportedContexts } from "./index.ts";

export let FilterContext: React.Context<any>;

webpackLoaded.subscribe(loaded => {
	if (!loaded) {
		return;
	}

	FilterContext = exportedContexts.find(c => (c as any)._currentValue2?.setFilter)!;
});
