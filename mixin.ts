/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { BehaviorSubject } from "https://esm.sh/rxjs";
import type { Transformer } from "/hooks/transform.ts";

export const webpackLoaded = new BehaviorSubject<boolean>(false);

export let transformer: Transformer;
export default async function (t: Transformer) {
	transformer = t;
	await import("./src/expose/index.js");
	await import("./src/registers/index.js");
}
