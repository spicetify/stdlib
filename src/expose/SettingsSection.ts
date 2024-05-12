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

import { transformer } from "../../mixin.js";

export type SettingsSectionProps = { filterMatchQuery: string };
export type SettingsSection = React.FC<SettingsSectionProps>;
export let SettingsSection = null! as SettingsSection;

export type SettingsSectionTitleProps = {};
export type SettingsSectionTitle = React.FC<SettingsSectionTitleProps>;
export let SettingsSectionTitle = null! as SettingsSectionTitle;

transformer<SettingsSection>(
   emit => str => {
      str = str.replace(
         /(\.jsxs\)\()([a-zA-Z_\$][\w\$]*)([^=]*"desktop.settings.compatibility")/,
         "$1(__SettingsSection=$2)$3",
      );
      Object.defineProperty(globalThis, "__SettingsSection", { set: emit });
      return str;
   },
   {
      then: ($: SettingsSection) => {
         SettingsSection = $;
      },
      glob: /^\/xpui-routes-desktop-settings\.js/,
      noAwait: true,
   },
);

transformer<SettingsSectionTitle>(
   emit => str => {
      str = str.replace(
         /("desktop.settings.compatibility"[^=]*?\.jsx\)\()([a-zA-Z_\$][\w\$]*)/,
         "$1(__SettingsSectionTitle=$2)",
      );
      Object.defineProperty(globalThis, "__SettingsSectionTitle", { set: emit });
      return str;
   },
   {
      then: ($: SettingsSectionTitle) => {
         SettingsSectionTitle = $;
      },
      glob: /^\/xpui-routes-desktop-settings\.js/,
      noAwait: true,
   },
);
