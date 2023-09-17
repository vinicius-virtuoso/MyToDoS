"use client";

import Link from "next/link";

import { useMenuApp } from "@/context/MenuAppProvider";
import { useTheme } from "@/context/ThemeProvider";
import { Menu, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();
  const { openMenu } = useMenuApp();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {pathname !== "/dashboard" && pathname !== "/profile" ? (
        <header className="w-full h-16 md:h-20 drop-shadow-md shadow-md">
          <div className="grid grid-cols-3 items-center justify-between w-full px-4 md:px-8 md:h-20 h-16">
            <div className="md:flex items-center justify-start">
              <strong className="text-md  md:text-2xl">MyToDoS</strong>
            </div>

            <button
              onClick={toggleTheme}
              className="font-bold dark:text-white flex items-center justify-center gap-4"
            >
              {theme === "light" ? (
                <Moon className="w-8 h-8 md:w-10 md:h-10" />
              ) : (
                <Sun className="w-8 h-8 md:w-10 md:h-10" />
              )}
            </button>

            <div className="flex gap-3 md:gap-5 justify-end">
              {pathname !== "/login" && pathname !== "/register" && (
                <>
                  <Link
                    href="/register"
                    className="text-xs md:text-md lg:text-lg flex items-center justify-center gap-5 cursor-pointer p-2 group text-white transition-colors duration-200 bg-blue-500 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600"
                  >
                    Registro
                  </Link>
                  <Link
                    href="/login"
                    className="text-xs md:text-md lg:text-lg flex items-center justify-center gap-5 cursor-pointer p-2 group border text-gray-700 transition-colors duration-200 bg-white rounded-lg gap-x-2 dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>
      ) : (
        <header className="w-full h-16 md:h-20 drop-shadow-md shadow-md">
          <div className="grid grid-cols-3 items-center justify-between w-full px-4 md:px-8 md:h-20 h-16 ">
            <div className="md:flex items-center justify-start">
              <strong className="text-md md:text-2xl">MyToDoS</strong>
            </div>
            <button
              onClick={toggleTheme}
              className="font-bold dark:text-white flex items-center justify-center gap-4"
            >
              {theme === "light" ? (
                <Moon className="w-8 h-8 md:w-10 md:h-10" />
              ) : (
                <Sun className="w-8 h-8 md:w-10 md:h-10" />
              )}
            </button>
            {pathname === "/dashboard" || pathname === "/profile" ? (
              <div
                className="flex items-center justify-end rounded-md"
                onClick={openMenu}
              >
                <Menu className="w-8 h-8 md:w-10 md:h-10" />
              </div>
            ) : null}
          </div>
        </header>
      )}
    </>
  );
};
