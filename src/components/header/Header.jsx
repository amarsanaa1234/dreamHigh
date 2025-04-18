import React from 'react'
import {
  Button, ButtonGroup, DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu, NavbarMenuItem,
  NavbarMenuToggle
} from "@heroui/react";
import {DarkModeSwitch} from "../DarkModeSwitch.jsx";
import {Link} from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    {name: "Тэмцээн", component: '/'},
    // {name: "Багийн бүртгэл", component: 'teamAdd'},
    // {name: "Тоглогчийн бүртгэл", component: 'playerAdd'},
    // {name: "Тоглолтын хуваарь", component: 'gameSchedule'},
  ];

  const AcmeLogo = () => {
    return (
      <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
        <path
          clipRule="evenodd"
          d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    );
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} shouldHideOnScroll>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">TEAM LUCIFER</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link to={"/"}>
            <Button color="primary" variant="shadow">Тэмцээн</Button>
          </Link>
        </NavbarItem>
        {/*<NavbarItem isActive>*/}
        {/*  <Link to={"/teamAdd"}>*/}
        {/*    <Button color="primary" variant="shadow">Багийн бүртгэл</Button>*/}
        {/*  </Link>*/}
        {/*</NavbarItem>*/}
        {/*<NavbarItem>*/}
        {/*  <Link to={"/playerAdd"}>*/}
        {/*    <Button color="primary" variant="shadow">Тоглогчийн бүртгэл</Button>*/}
        {/*  </Link>*/}
        {/*</NavbarItem>*/}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <DarkModeSwitch />
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              to={`/${item.component}`}
              size="lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}