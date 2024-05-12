/* Copyright © 2024
 *      Delusoire <deluso7re@outlook.com>
 *
 * This file is part of bespoke/modules/stdlib.
 *
 * bespoke/modules/stdlib is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * bespoke/modules/stdlib is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with bespoke/modules/stdlib. If not, see <https://www.gnu.org/licenses/>.
 */

export * from "./src/static.js";

import { S as _S } from "./src/expose/index.js";
export const S = _S;

import type { LoadableModule, Module } from "/hooks/module.js";

import { Registrar } from "./src/registers/registers.js";
import { BehaviorSubject, Subscription } from "https://esm.sh/rxjs";

export const createRegistrar = (mod: LoadableModule) => {
   const registrar = new Registrar(mod.getModuleIdentifier());
   const unloadJS = mod.unloadJS!;
   mod.unloadJS = () => {
      registrar!.dispose();
      return unloadJS();
   };
   return registrar;
};

const hookedNativeStorageMethods = new Set(["getItem", "setItem", "removeItem"]);
export const createStorage = <M extends Module>(mod: M & { storage?: Storage }) => {
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

export const createLogger = (mod: Module & { logger?: Console }) => {
   if (!mod.logger) {
      const hookedMethods = new Set(["debug", "error", "info", "log", "warn"]);

      mod.logger = new Proxy(globalThis.console, {
         get(target, p, receiver) {
            if (typeof p === "string" && hookedMethods.has(p)) {
               // @ts-ignore
               return (...data: any[]) => target[p](`[${mod.getModuleIdentifier()}]:`, ...data);
            }

            return target[p as keyof typeof target];
         },
      });
   }

   return mod.logger;
};

const PlayerAPI = S.Platform.getPlayerAPI();
const History = S.Platform.getHistory();

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

export const createEventBus = (mod: LoadableModule) => {
   const eventBus = newEventBus();
   // TODO: come up with a nicer solution
   const s = new Subscription();
   s.add(EventBus.Player.song_changed.subscribe(eventBus.Player.song_changed));
   s.add(EventBus.Player.state_updated.subscribe(eventBus.Player.state_updated));
   s.add(EventBus.Player.status_changed.subscribe(eventBus.Player.status_changed));
   s.add(EventBus.History.updated.subscribe(eventBus.History.updated));
   const unloadJS = mod.unloadJS!;
   mod.unloadJS = () => {
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
