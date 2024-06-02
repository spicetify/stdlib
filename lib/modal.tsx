/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { React } from "../src/expose/React.ts";
import { UI } from "../src/webpack/ComponentLibrary.ts";
import { Locale } from "../src/webpack/misc.ts";
import { GenericModal } from "../src/webpack/ReactComponents.ts";

import RootRegistry from "../src/registers/root.ts";
import { createIconComponent } from "./createIconComponent.tsx";

let close: (() => void) | undefined = undefined;
let ref: React.ReactElement | undefined = undefined;

export function display({
	title: contentLabel,
	content: children,
	isLarge: isEmbedWidgetGeneratorOrTrackCreditsModal,
}: {
	title: string;
	content: React.ReactElement;
	isLarge: boolean;
}) {
	hide();

	const PopupModal = () => {
		const [isOpen, setIsOpen] = React.useState(true);

		close = () => setIsOpen(false);

		if (isEmbedWidgetGeneratorOrTrackCreditsModal) {
			return (
				<GenericModal isOpen={isOpen} contentLabel={contentLabel}>
					<div className="uUYNnjSt8m3EqVjsnHgh" style={{ overflow: "scroll", width: "60vw" }}>
						<div className="bOIRpQiHUAEfp8ntStTo">
							<UI.Text as="h1" variant="titleSmall">
								{contentLabel}
							</UI.Text>
							<button className="oBoIIlKrwQjxXpvOiOa0" onClick={close}>
								{createIconComponent({
									icon: "<path d='M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06Z'/>",
									"aria-label": Locale.get("close"),
								})}
							</button>
						</div>
						<div className="IJHNf0vxPSbPE1egoG4N">{children}</div>
					</div>
				</GenericModal>
			);
		}

		return (
			<GenericModal isOpen={isOpen} contentLabel={contentLabel}>
				<div className="uV8q95GGAb2VDtL3gpYa">
					<div className="pGU_qEtNT1qWKjrRbvan">
						<UI.Text as="h1" variant="titleMedium">
							{contentLabel}
						</UI.Text>
						<button
							className="VKCcyYujazVPj6VkksPM"
							aria-label={Locale.get("close")}
							onClick={close}
						>
							{createIconComponent({
								icon: "<path d='M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06Z'/>",
								"aria-label": Locale.get("close"),
								iconSize: 18,
							})}
						</button>
					</div>
					<div className="Nw1INlIyra3LT1JjvoqH">{children}</div>
				</div>
			</GenericModal>
		);
	};
	ref = React.createElement(PopupModal);
	RootRegistry.register(ref, () => true);
}

export function hide() {
	close?.();
	ref && RootRegistry.unregister(ref);
}
