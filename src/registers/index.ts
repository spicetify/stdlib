/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import menu from "./menu.js";
import navlink from "./navlink.js";
import panel from "./panel.js";
import playbarButton from "./playbarButton.js";
import playbarWidget from "./playbarWidget.js";
import root from "./root.js";
import route from "./route.js";
import settingsSection from "./settingsSection.js";
import topbarLeftButton from "./topbarLeftButton.js";
import topbarRightButton from "./topbarRightButton.js";

const registers = {
	menu,
	navlink,
	panel,
	playbarButton,
	playbarWidget,
	root,
	route,
	settingsSection,
	topbarLeftButton,
	topbarRightButton,
};
type Registers = typeof registers;

export class Registrar {
	constructor(public id: string) {}

	private ledger = new Map<any, keyof Registers>();

	register<R extends keyof Registers>(type: R, ...args: Parameters<Registers[R]["add"]>) {
		this.ledger.set(args[0], type);
		// @ts-ignore
		registers[type].add(...args);
	}

	unregister<R extends keyof Registers>(type: R, ...args: Parameters<Registers[R]["delete"]>) {
		this.ledger.delete(args[0]);
		// @ts-ignore
		registers[type].delete(...args);
	}

	dispose() {
		for (const [item, type] of this.ledger.entries()) this.unregister(type, item);
		this.ledger.clear();
	}
}
