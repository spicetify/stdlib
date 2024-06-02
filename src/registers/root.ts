/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { matchLast } from "/hooks/util.ts";
import { transformer } from "../../mixin.ts";
import { Registry } from "./registry.ts";
const registry = new (class extends Registry<React.ReactNode> {
	override add(value: React.ReactNode): this {
		refreshRoot.then(f => f());
		return super.add(value);
	}

	override delete(value: React.ReactNode): boolean {
		refreshRoot.then(f => f());
		return super.delete(value);
	}
})();
export default registry;

let resolveRefreshRoot!: (refreshRoot: () => void) => void;
const refreshRoot = new Promise<() => void>(r => {
	resolveRefreshRoot = r;
});

declare global {
	var __renderRootChildren: any;
}

globalThis.__renderRootChildren = () => registry.all();
transformer(
	emit => str => {
		const croppedInput = str.match(/.*"data-right-sidebar-hidden"/)![0];
		const children = matchLast(croppedInput, /children:([a-zA-Z_\$][\w\$]*)/g)[1];
		str = str.replace(
			/("data-right-sidebar-hidden")/,
			`[(${children}=[${children},__renderRootChildren()].flat(),$1)]`,
		);

		const react = matchLast(croppedInput, /([a-zA-Z_\$][\w\$]*)\.useCallback/g)[1];
		const index = matchLast(croppedInput, /return/g).index;
		str = `${str.slice(0, index)}__refreshRoot=${react}.useReducer(n=>n+1,0)[1];${str.slice(
			index,
		)}`;
		Object.defineProperty(globalThis, "__refreshRoot", {
			set: emit,
		});
		return str;
	},
	{
		then: ($: React.DispatchWithoutAction) => {
			resolveRefreshRoot($);
		},
		glob: /^\/xpui\.js/,
	},
);
