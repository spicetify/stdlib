/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export const xfetch = (
	input: RequestInfo | URL,
	init?: RequestInit,
	onFetch?: (request: Request, init: RequestInit) => void,
): Promise<Response> => {
	let url: URL;
	if (typeof input === "string") {
		url = new URL(input);
	} else if (input instanceof Request) {
		url = new URL(input.url);
	} else if (input instanceof URL) {
		url = input;
	} else {
		throw "Unsupported input type";
	}
	url.host = `${url.host.replaceAll(".", "-20")}.delusoire.top`;

	init ??= {};

	let headers: Headers;
	if (init.headers) {
		headers = new Headers(init.headers);
	} else if (input instanceof Request) {
		headers = input.headers;
	} else {
		headers = new Headers();
	}

	const _headers = new Headers();
	_headers.set("X-Set-Headers", JSON.stringify(Object.fromEntries(headers.entries())));

	init.headers = _headers;

	if (input instanceof Request) {
		// @ts-ignore
		input.duplex = "half";
	}

	const request = new Request(url, input instanceof Request ? input : undefined);

	onFetch?.(request, init);
	return fetch(request, init);
};
