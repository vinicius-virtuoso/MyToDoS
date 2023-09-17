"use client";

import { useAuth } from "@/context/AuthProvider";
import { useMenuApp } from "@/context/MenuAppProvider";
import { useTheme } from "@/context/ThemeProvider";
import { useUser } from "@/context/UserProvider";
import { motion } from "framer-motion";
import { LayoutDashboard, LogOut, Moon, Settings, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const MenuApp = () => {
  const { closeMenu } = useMenuApp();
  const { user, getUser } = useUser();
  const { logout } = useAuth();
  const pathname = usePathname();

  const handleClickInside = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
      onClick={closeMenu}
      className="w-full bg-black/30 dark:bg-black/50 absolute top-0 bottom-0 right-0 left-0 z-50"
    >
      <motion.div
        initial={{ opacity: 0, width: "0%" }}
        animate={{ opacity: 1, width: "100%" }}
        exit={{ opacity: 0, width: 0 }}
        layout
        onClick={handleClickInside}
        className="absolute top-0 right-0 bottom-0 w-full max-w-xs z-50 bg-white dark:bg-zinc-900 shadow-xl drop-shadow-md flex overflow-hidden flex-col items-start"
      >
        <div className="w-full flex items-center justify-between h-16 md:h-20 drop-shadow-md shadow-md md:px-8 px-4 py-5 dark:text-white text-zinc-700">
          <span className="text-2xl font-bold tracking-wider">
            {user?.name}
          </span>
          <button onClick={closeMenu}>
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>
        </div>
        <div className="w-full md:p-8 p-4 grid grid-rows-[1fr,minmax(4rem,5rem)] h-full">
          <div className="w-full space-y-3">
            {pathname === "/dashboard" && (
              <Link
                href="/profile"
                className="hover:bg-zinc-200 dark:hover:bg-zinc-950 w-full h-12 dark:text-white dark:bg-zinc-900 font-bold border border-zinc-700 flex items-center justify-start p-4 rounded-md shadow-md gap-4"
              >
                <Settings />
                Editar perfil
              </Link>
            )}

            {pathname === "/profile" && (
              <Link
                href="/dashboard"
                className="hover:bg-zinc-200 dark:hover:bg-zinc-950 w-full h-12 dark:text-white dark:bg-zinc-900 font-bold border border-zinc-700 flex items-center justify-start p-4 rounded-md shadow-md gap-4"
              >
                <LayoutDashboard />
                Dashboard
              </Link>
            )}
          </div>
          <footer className="w-full flex items-center justify-between">
            <button
              onClick={logout}
              className="hover:bg-zinc-200 dark:hover:bg-zinc-950 w-full h-12 dark:text-white dark:bg-zinc-900 font-bold border border-zinc-700 flex items-center justify-start p-4 rounded-md shadow-md gap-4"
            >
              <LogOut />
              Sair
            </button>
          </footer>
        </div>
      </motion.div>
    </motion.div>
  );
};
