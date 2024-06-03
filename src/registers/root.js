/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { transformer } from "../../mixin.js";
import { Registry } from "./registry.js";
import { React } from "../expose/React.js";
const registry = new class extends Registry {
    add(value) {
        const ret = super.add(value);
        queueRefresh();
        return ret;
    }
    delete(value) {
        const ret = super.delete(value);
        queueRefresh();
        return ret;
    }
}();
export default registry;
function queueRefresh() {
    if (refreshRoot.value) {
        refreshRoot.value();
    } else {
        refreshRoot.promise.then((value)=>value());
    }
}
const refreshRoot = Object.assign(Promise.withResolvers(), {
    value: undefined
});
globalThis.__renderRootChildren = ()=>React.createElement(()=>{
        const [, refresh] = React.useReducer((n)=>n + 1, 0);
        if (!refreshRoot.value) {
            refreshRoot.resolve(refresh);
        }
        refreshRoot.value = refresh;
        return registry.all();
    });
transformer((emit)=>(str)=>{
        str = str.replace(/children:\[([^\]]+"data-testid.:.root")/, "children:[__renderRootChildren(),$1");
        emit();
        return str;
    }, {
    glob: /^\/xpui\.js/
});
