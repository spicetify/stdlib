/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { React } from "../expose/React.js";
import { createIconComponent } from "../../lib/createIconComponent.js";
import { transformer } from "../../mixin.js";
import { Tooltip } from "../webpack/ReactComponents.js";
import { UI } from "../webpack/ComponentLibrary.js";
import { classnames } from "../webpack/ClassNames.js";
import { Registry } from "./registry.js";

const registry = new Registry<React.ReactNode>();
export default registry;

declare global {
	var __renderPlaybarBarControls: any;
}

globalThis.__renderPlaybarBarControls = () => registry.all().reverse();
transformer(
	emit => str => {
		str = str.replace(
			/(children:\[)([^\[]*djJumpButtonFactory)/,
			"$1...__renderPlaybarBarControls(),$2",
		);
		emit();
		return str;
	},
	{
		glob: /^\/xpui\.js/,
	},
);

export type PlaybarButtonProps = {
	label: string;
	isActive?: boolean;
	isActiveNoIndicator?: boolean;
	disabled?: boolean;
	icon?: string;
	onClick: () => void;
};
export const PlaybarButton = ({
	label,
	isActive = false,
	isActiveNoIndicator = false,
	disabled = false,
	icon,
	onClick,
}: PlaybarButtonProps) => (
	<Tooltip label={label}>
		<UI.ButtonTertiary
			aria-label={label}
			size="small"
			className={classnames(CLASSMAP.main.playbar.buttons.button.wrapper, {
				[CLASSMAP.main.playbar.buttons.button.wrapper__indicator]: isActive,
				[CLASSMAP.main.playbar.buttons.button.wrapper__active]: isActive || isActiveNoIndicator,
			})}
			disabled={disabled}
			iconOnly={icon && (() => createIconComponent({ icon }))}
			onClick={onClick}
			data-active={isActive.toString()}
			aria-pressed={isActive}
		/>
	</Tooltip>
);
