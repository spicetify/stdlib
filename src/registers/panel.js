/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { transformer } from "../../mixin.js";
import { Registry } from "./registry.js";
export let Machine;
const registry = new class extends Registry {
    static NodeNash = Symbol.for("NodeHash");
    getHash(value) {
        if (!this.has(value)) {
            return null;
        }
        // @ts-ignore
        const hash = value[this.constructor.NodeNash];
        const state = `bespoke_${hash}`;
        const event = `bespoke_${hash}_button_click`;
        return {
            state,
            event
        };
    }
    add(value, onEntry, onExit) {
        const hash = crypto.randomUUID();
        // @ts-ignore
        value[this.constructor.NodeNash] = hash;
        const state = `bespoke_${hash}`;
        const event = `bespoke_${hash}_button_click`;
        stateToNode.set(state, value);
        ON[event] = {
            target: state
        };
        STATES[state] = {
            on: Object.setPrototypeOf({
                [event]: {
                    target: "disabled"
                }
            }, ON)
        };
        if (onEntry) {
            const entry = `bespoke_${hash}_entry`;
            STATES[state].entry = [
                entry
            ];
            ACTIONS[entry] = onEntry;
        }
        if (onExit) {
            const exit = `bespoke_${hash}_exit`;
            Machine.config.states[state].exit = [
                exit
            ];
            ACTIONS[exit] = onExit;
        }
        return super.add(value);
    }
    delete(item) {
        // @ts-ignore
        const hash = item[this.constructor.NodeNash];
        const state = `bespoke_${hash}`;
        const event = `bespoke_${hash}_button_click`;
        stateToNode.delete(state);
        delete ON[event];
        return super.delete(item);
    }
}();
export default registry;
const stateToNode = new Map();
globalThis.__renderPanel = (state)=>{
    if (!state.startsWith("bespoke")) {
        return null;
    }
    return stateToNode.get(state);
};
let ON = {};
let STATES = {};
let ACTIONS = {};
transformer((emit)=>(str)=>{
        str = str.replace(/(=\(0,[a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*\)\(\{id:"RightPanelState)/, "=__Machine$1");
        Object.defineProperty(globalThis, "__Machine", {
            set: ($)=>{
                Machine = $;
                queueMicrotask(()=>{
                    ON = {
                        ...ON,
                        ...Machine.config.states.disabled.on,
                        panel_close_click_or_collapse: [
                            {
                                target: "disabled"
                            }
                        ]
                    };
                    delete ON.playback_autoplay_context_changed;
                    for (const [k, v] of Object.entries(Machine.config.states)){
                        if (k === "puffin_activation") {
                            continue;
                        }
                        v.on = new Proxy(v.on, {
                            get (target, p, receiver) {
                                // @ts-ignore
                                if (p.startsWith("bespoke")) {
                                    // @ts-ignore
                                    return ON[p];
                                }
                                // @ts-ignore
                                return target[p];
                            }
                        });
                    }
                    Object.setPrototypeOf(Machine.config.states, STATES);
                    Machine._options.actions = ACTIONS;
                });
            },
            get: ()=>Machine
        });
        // ! HACKY ALERT
        str = str.replace(/(case [a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*\.Disabled:return!0;default:)/, "$1return true;");
        str = str.replace(/(\(([a-zA-Z_\$][\w\$]*),"PanelSection".+?children:\[?)/, "$1__renderPanel($2)??");
        emit();
        return str;
    }, {
    glob: /^\/xpui\.js/
});
