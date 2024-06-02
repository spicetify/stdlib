/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ export class Registry extends Set {
    _E;
    all() {
        return Array.from(this);
    }
}
