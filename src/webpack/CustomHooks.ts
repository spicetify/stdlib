/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { webpackLoaded } from "../../mixin.ts";
import { Platform } from "../expose/Platform.ts";
import { exportedFunctions, exports } from "./index.ts";
import { findBy } from "/hooks/util.ts";

export let DragHandler: Function;
export let useExtractedColor: Function;
export let usePanelAPI: Function;

export let imageAnalysis: Function;
export let fallbackPreset: any;

export let extractColorPreset = async (image: any) => {
	const analysis = await imageAnalysis(Platform.getGraphQLLoader(), image);
	for (const result of analysis) {
		if ("isFallback" in result === false) {
			result.isFallback = fallbackPreset === result; // Why ?
		}
	}

	return analysis;
};
export let getPlayContext: Function;

export let useContextMenuState: Function;

export let useLocation: Function;

webpackLoaded.subscribe(loaded => {
	if (!loaded) {
		return;
	}

	DragHandler = findBy("dataTransfer", "data-dragging")(exportedFunctions);
	useExtractedColor = exportedFunctions.find(
		m =>
			m.toString().includes("extracted-color") ||
			(m.toString().includes("colorRaw") && m.toString().includes("useEffect")),
	)!;
	usePanelAPI = findBy("panelSend", "context")(exportedFunctions);

	useContextMenuState = findBy("useContextMenuState")(exportedFunctions);

	imageAnalysis = findBy(/\![a-zA-Z_\$][\w\$]*\.isFallback|\{extractColor/)(exportedFunctions);
	fallbackPreset = exports.find(m => m.colorDark);

	getPlayContext = findBy("referrerIdentifier", "usePlayContextItem")(exportedFunctions);

	useLocation = findBy("location", "useContext")(exportedFunctions);
});
