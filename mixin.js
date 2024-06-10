/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ export let transformer;
export default async function(t) {
    transformer = t;
    await import("./src/expose/index.js");
    await import("./src/registers/index.js");
}
