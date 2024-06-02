/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { webpackLoaded } from "../../mixin.ts";
import { exportedFunctions } from "./index.ts";
import { findBy } from "/hooks/util.ts";

import type {
	useSnackbar as useSnackbarT,
	OptionsObject as OptionsObjectT,
	EnqueueSnackbar as EnqueueSnackbarT,
} from "npm:notistack";

export type useSnackbar = typeof useSnackbarT;
export type OptionsObject = OptionsObjectT;
export type EnqueueSnackbar = EnqueueSnackbarT;

export let useSnackbar: useSnackbar;

type FN_enqueueCustomSnackbar_OPTS =
	| (Omit<OptionsObject, "key"> & { keyPrefix: string; })
	| (OptionsObject & { identifier: string; });
export let enqueueCustomSnackbar: (
	element: React.ReactElement,
	opts: FN_enqueueCustomSnackbar_OPTS,
) => ReturnType<EnqueueSnackbar>;

webpackLoaded.subscribe(() => {
	useSnackbar = findBy(
		/^function\(\)\{return\(0,[a-zA-Z_\$][\w\$]*\.useContext\)\([a-zA-Z_\$][\w\$]*\)\}$/,
	)(exportedFunctions);

	enqueueCustomSnackbar = findBy("enqueueCustomSnackbar", "headless")(exportedFunctions) as any;
});
