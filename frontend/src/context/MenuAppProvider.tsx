"use client";

import { usePathname } from "next/navigation";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface MenuAppContextProps {
  openMenu: () => void;
  closeMenu: () => void;
  isOpenMenu: boolean;
}

const MenuAppContext = createContext({} as MenuAppContextProps);

export const MenuAppProvider = ({ children }: { children: ReactNode }) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const pathname = usePathname();

  const openMenu = () => setIsOpenMenu(true);
  const closeMenu = () => setIsOpenMenu(false);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  return (
    <MenuAppContext.Provider value={{ isOpenMenu, openMenu, closeMenu }}>
      {children}
    </MenuAppContext.Provider>
  );
};

export const useMenuApp = () => useContext(MenuAppContext);
