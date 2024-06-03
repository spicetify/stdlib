/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { webpackLoaded } from "./mixin.ts";
webpackLoaded.next(true);

import type { ModuleInstance } from "/hooks/module.ts";

import { Platform } from "./src/expose/Platform.ts";
import { Registrar } from "./src/registers/index.ts";

import { BehaviorSubject, Subscription } from "https://esm.sh/rxjs";

export const createRegistrar = (mod: ModuleInstance) => {
	const registrar = new Registrar(mod.getModuleIdentifier());
	const unloadJS = mod._unloadJS!;
	mod._unloadJS = () => {
		registrar!.dispose();
		return unloadJS();
	};
	return registrar;
};

export const createStorage = (mod: ModuleInstance) => {
	const hookedNativeStorageMethods = new Set(["getItem", "setItem", "removeItem"]);

	return new Proxy(globalThis.localStorage, {
		get(target, p, receiver) {
			if (typeof p === "string" && hookedNativeStorageMethods.has(p)) {
				return (key: string, ...data: any[]) =>
					target[p](`module:${mod.getModuleIdentifier()}:${key}`, ...data);
			}

			return target[p as keyof typeof target];
		},
	});
};

export const createLogger = (mod: ModuleInstance) => {
	const hookedMethods = new Set(["debug", "error", "info", "log", "warn"]);

	return new Proxy(globalThis.console, {
		get(target, p, receiver) {
			if (typeof p === "string" && hookedMethods.has(p)) {
				// @ts-ignore
				return (...data: any[]) => target[p](`[${mod.getModuleIdentifier()}]:`, ...data);
			}

			return target[p as keyof typeof target];
		},
	});
};

const PlayerAPI = Platform.getPlayerAPI();
const History = Platform.getHistory();

const newEventBus = () => {
	const playerState = PlayerAPI.getState();
	return {
		Player: {
			state_updated: new BehaviorSubject(playerState),
			status_changed: new BehaviorSubject(playerState),
			song_changed: new BehaviorSubject(playerState),
		},
		History: {
			updated: new BehaviorSubject(History.location),
		},
	};
};

const EventBus = newEventBus();
export type EventBus = typeof EventBus;

export const createEventBus = (mod: ModuleInstance) => {
	const eventBus = newEventBus();
	// TODO: come up with a nicer solution
	const s = new Subscription();
	s.add(EventBus.Player.song_changed.subscribe(eventBus.Player.song_changed));
	s.add(EventBus.Player.state_updated.subscribe(eventBus.Player.state_updated));
	s.add(EventBus.Player.status_changed.subscribe(eventBus.Player.status_changed));
	s.add(EventBus.History.updated.subscribe(eventBus.History.updated));
	const unloadJS = mod._unloadJS!;
	mod._unloadJS = () => {
		s.unsubscribe();
		return unloadJS();
	};

	return eventBus;
};

let cachedState = {};
const listener = ({ data: state }) => {
	EventBus.Player.state_updated.next(state);
	if (state?.item?.uri !== cachedState?.item?.uri) EventBus.Player.song_changed.next(state);
	if (state?.isPaused !== cachedState?.isPaused || state?.isBuffering !== cachedState?.isBuffering)
		EventBus.Player.status_changed.next(state);
	cachedState = state;
};
PlayerAPI.getEvents().addListener("update", listener);

const cancel = History.listen(location => EventBus.History.updated.next(location));

export default function () {
	return () => {
		PlayerAPI.getEvents().removeListener("update", listener);
		cancel();
	};
}
