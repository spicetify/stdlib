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
 */ import menu from "./menu.js";
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
    topbarRightButton
};
export class Registrar {
    id;
    constructor(id){
        this.id = id;
        this.ledger = new Map();
    }
    ledger;
    register(type, ...args) {
        this.ledger.set(args[0], type);
        // @ts-ignore
        registers[type].add(...args);
    }
    unregister(type, ...args) {
        this.ledger.delete(args[0]);
        // @ts-ignore
        registers[type].delete(...args);
    }
    dispose() {
        for (const [item, type] of this.ledger.entries())this.unregister(type, item);
        this.ledger.clear();
    }
}
