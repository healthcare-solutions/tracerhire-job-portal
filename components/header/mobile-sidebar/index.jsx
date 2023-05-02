"use client";
import Link from "next/link";
import {
  ProSidebarProvider,
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";

import mobileMenuData from "../../../data/mobileMenuData";
import SidebarFooter from "./SidebarFooter";
import SidebarHeader from "./SidebarHeader";
import {
  isActiveLink,
  isActiveParentChaild,
} from "../../../utils/linkActiveChecker";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import employerMenuData from "../../../data/employerMenuData";
import candidatesMenuData from "../../../data/candidatesMenuData";
import { logout } from "../../../utils/logout";

const Index = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector(state => state.candidate.user)
  const menuOptions = user.role !== 'CANDIDATE' ?  employerMenuData : candidatesMenuData

  return (
    <div
      className="offcanvas offcanvas-start mobile_menu-contnet"
      tabIndex="-1"
      id="offcanvasMenu"
      data-bs-scroll="true"
    >
      <SidebarHeader />
      {/* End pro-header */}

      <ProSidebarProvider>
        {/* <Sidebar> */}
        {user ? 
          <Menu>
            {menuOptions.map((menuItem, i) => (
              <MenuItem
                className={
                  isActiveLink(menuItem.routePath, router.asPath)
                    ? "menu-active-link"
                    : ""
                }
                key={i}
                routerLink=
                  {
                    <Link href={menuItem.routePath}
                      onClick={(e) => {
                        if(menuItem.name == 'Logout'){
                          logout(dispatch)
                        }
                      }}/>
                  }
              >
                {menuItem.name}
              </MenuItem>
            ))}
          </Menu> : ''}
        {/* </Sidebar> */}
      </ProSidebarProvider>

      <SidebarFooter />
    </div>
  );
};

export default Index;
