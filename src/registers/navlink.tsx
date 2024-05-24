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

import { React } from "../expose/React.js";
import { findMatchingPos } from "/hooks/util.js";
import { createIconComponent } from "../../lib/createIconComponent.js";
import { transformer } from "../../mixin.js";
import { Platform } from "../expose/Platform.js";
import { classnames } from "../webpack/ClassNames.js";
import { Nav, ScrollableContainer, Tooltip } from "../webpack/ReactComponents.js";
import { UI } from "../webpack/ComponentLibrary.js";
import { Registry } from "./registry.js";

const registry = new ( class extends Registry<React.ReactNode> {
   override add( value: React.ReactNode ): this {
      refresh?.();
      return super.add( value );
   }

   override delete( value: React.ReactNode ): boolean {
      refresh?.();
      return super.delete( value );
   }
} );
export default registry;

let refresh: React.DispatchWithoutAction | undefined;

declare global {
   var __renderNavLinks: any;
}

let navLinkFactoryCtx: React.Context<React.FC<NavLinkFactoryProps>>;
globalThis.__renderNavLinks = ( isTouchscreenUi: boolean ) =>
   React.createElement( () => {
      [ , refresh ] = React.useReducer( n => n + 1, 0 );

      if ( !ScrollableContainer ) {
         return;
      }

      const navLinkFactory = isTouchscreenUi ? _NavLinkGlobal : _NavLinkSidebar;

      if ( !navLinkFactoryCtx ) navLinkFactoryCtx = React.createContext<React.FC<NavLinkFactoryProps>>( null! );

      const children = (
         <navLinkFactoryCtx.Provider value={ navLinkFactory }>
            { registry.all() }
         </navLinkFactoryCtx.Provider>
      );

      return isTouchscreenUi ? (
         <ScrollableContainer className="custom-navlinks-scrollable_container">{ children }</ScrollableContainer>
      ) : (
         children
      );
   } );
transformer(
   emit => str => {
      const j = str.search( /\("li",\{[^\{]*\{[^\{]*\{to:"\/search/ );
      const i = findMatchingPos( str, j, 1, [ "(", ")" ], 1 );

      str = `${ str.slice( 0, i ) },__renderNavLinks(false)${ str.slice( i ) }`;

      str = str.replace(
         /(,[a-zA-Z_\$][\w\$]*===(?:[a-zA-Z_\$][\w\$]*\.){2}HOME_NEXT_TO_NAVIGATION&&.+?)\]/,
         "$1,__renderNavLinks(true)]",
      );

      str = str.replace( /(\["\/","\/home\/")/, '$1,"/bespoke/*"' );

      emit();
      return str;
   },
   {
      glob: /^\/xpui\.js/,
   },
);

export type NavLinkProps = { localizedApp: string; appRoutePath: string; icon: string; activeIcon: string; };
export const NavLink: React.FC<NavLinkProps> = props => {
   const isActive = Platform.getHistory().location.pathname?.startsWith( props.appRoutePath );
   const createIcon = () =>
      createIconComponent( { icon: isActive ? props.activeIcon : props.icon, iconSize: 24 } );

   const NavLinkFactory = React.useContext( navLinkFactoryCtx );

   return (
      NavLinkFactory && (
         <NavLinkFactory
            localizedApp={ props.localizedApp }
            appRoutePath={ props.appRoutePath }
            createIcon={ createIcon }
            isActive={ isActive }
         />
      )
   );
};

interface NavLinkFactoryProps {
   localizedApp: string;
   appRoutePath: string;
   createIcon: () => React.ReactNode;
   isActive: boolean;
}

const _NavLinkSidebar: React.FC<NavLinkFactoryProps> = props => {
   const isSidebarCollapsed = Platform.getLocalStorageAPI().getItem( "ylx-sidebar-state" ) === 1;

   return (
      <li className="KAcp7QFuEYSouAsuC5i_ InvalidDropTarget">
         <Tooltip
            label={ isSidebarCollapsed ? props.localizedApp : null }
            disabled={ !isSidebarCollapsed }
            placement="right"
         >
            <Nav
               to={ props.appRoutePath }
               referrer="other"
               className={ classnames( "link-subtle", "hNvCMxbfz7HwgzLjt3IZ", {
                  "Bh3b80dIrbc0keQ9kdso ": props.isActive,
               } ) }
               onClick={ () => undefined }
               aria-label={ props.localizedApp }
            >
               { props.createIcon() }
               { !isSidebarCollapsed && <UI.Text variant="bodyMediumBold">{ props.localizedApp }</UI.Text> }
            </Nav>
         </Tooltip>
      </li>
   );
};

const _NavLinkGlobal: React.FC<NavLinkFactoryProps> = props => {
   return (
      <div className="inline-flex">
         <Tooltip label={ props.localizedApp }>
            <UI.ButtonTertiary
               iconOnly={ props.createIcon }
               className={ classnames(
                  "bWBqSiXEceAj1SnzqusU",
                  "jdlOKroADlFeZZQeTdp8",
                  "cUwQnQoE3OqXqSYLT0hv",
                  "custom-navlink",
                  {
                     voA9ZoTTlPFyLpckNw3S: props.isActive,
                  },
               ) }
               aria-label={ props.localizedApp }
               onClick={ () => Platform.getHistory().push( props.appRoutePath ) }
            />
         </Tooltip>
      </div>
   );
};
