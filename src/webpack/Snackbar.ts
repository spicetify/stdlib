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

import { webpackLoaded } from "../../mixin";
import { exportedFunctions } from "./index.js";
import { findBy } from "/hooks/util.js";

import type {
   useSnackbar as useSnackbarT,
   OptionsObject as OptionsObjectT,
   EnqueueSnackbar as EnqueueSnackbarT,
} from "notistack";

export type useSnackbar = typeof useSnackbarT;
export type OptionsObject = OptionsObjectT;
export type EnqueueSnackbar = EnqueueSnackbarT;

export let useSnackbar: useSnackbar;

type FN_enqueueCustomSnackbar_OPTS =
   | ( Omit<OptionsObject, "key"> & { keyPrefix: string; } )
   | ( OptionsObject & { identifier: string; } );
export let enqueueCustomSnackbar: (
   element: React.ReactElement,
   opts: FN_enqueueCustomSnackbar_OPTS,
) => ReturnType<EnqueueSnackbar>;


webpackLoaded.subscribe( () => {

   useSnackbar = findBy(
      /^function\(\)\{return\(0,[a-zA-Z_\$][\w\$]*\.useContext\)\([a-zA-Z_\$][\w\$]*\)\}$/,
   )( exportedFunctions );

   enqueueCustomSnackbar = findBy( "enqueueCustomSnackbar", "headless" )( exportedFunctions ) as any;

} );
