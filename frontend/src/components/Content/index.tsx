"use client";

import React from "react";
import clsx from "clsx";
import { Inter } from "next/font/google";
import { useModalEdit } from "@/context/ModalEditProvider";
import { useModalCreate } from "@/context/ModalCreateProvider";
const inter = Inter({ subsets: ["latin"] });

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { MenuApp } from "../MenuApp";
import { useMenuApp } from "@/context/MenuAppProvider";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeProvider";
import { Header } from "../Header";

export const Content = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const { showModal } = useModalEdit();
  const { showModalCreate } = useModalCreate();
  const { isOpenMenu } = useMenuApp();
  const { token } = useAuth();

  return (
    <body
      className={clsx(`${inter.className} ${theme} font-arial h-full`, {
        "overflow-hidden": showModal || showModalCreate || isOpenMenu,
      })}
    >
      <ProgressBar
        color="#125de9"
        height="5px"
        options={{ showSpinner: false, easing: "ease" }}
      />
      <main className="transition-colors duration-500 w-full h-full min-h-screen grid grid-rows-[minmax(4rem,5rem),1fr] bg-slate-100 dark:bg-zinc-900 dark:text-zinc-100 text-zinc-700">
        <Header />
        {children}
      </main>
      <AnimatePresence>
        {token && isOpenMenu ? <MenuApp /> : null}
      </AnimatePresence>
    </body>
  );
};
