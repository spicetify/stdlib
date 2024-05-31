/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { React } from "../expose/React.js";
import { createIconComponent } from "../../lib/createIconComponent.js";
import { transformer } from "../../mixin.js";
import { Tooltip } from "../webpack/ReactComponents.js";
import { UI } from "../webpack/ComponentLibrary.js";
import { Registry } from "./registry.js";

const registry = new Registry<React.ReactNode>();
export default registry;

declare global {
	var __renderNowPlayingWidgets: any;
}

globalThis.__renderNowPlayingWidgets = () => registry.all();
transformer(
	emit => str => {
		str = str.replace(/(hideButtonFactory[^\]]*)/, "$1,...__renderNowPlayingWidgets()");
		emit();
		return str;
	},
	{
		glob: /^\/xpui\.js/,
	},
);

export type PlaybarWidgetProps = { label: string; icon?: string; onClick: () => void };
export const PlaybarWidget = ({ label, icon, onClick }: PlaybarWidgetProps) => (
	<Tooltip label={label}>
		<UI.ButtonTertiary
			size="small"
			className={undefined}
			aria-label={label}
			condensed={false}
			iconOnly={icon && (() => createIconComponent({ icon }))}
			onClick={onClick}
		/>
	</Tooltip>
);
