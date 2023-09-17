"use client";

import { ReactNode, createContext, useContext, useState } from "react";

interface ModalCreateContextProps {
  showModalCreate: boolean;
  openModalCreate: () => void;
  closeModalCreate: () => void;
}

const ModalCreateContext = createContext({} as ModalCreateContextProps);

export const ModalCreateProvider = ({ children }: { children: ReactNode }) => {
  const [showModalCreate, setShowModalCreate] = useState(false);

  const openModalCreate = () => setShowModalCreate(true);
  const closeModalCreate = () => setShowModalCreate(false);

  return (
    <ModalCreateContext.Provider
      value={{ openModalCreate, closeModalCreate, showModalCreate }}
    >
      {children}
    </ModalCreateContext.Provider>
  );
};

export const useModalCreate = () => useContext(ModalCreateContext);
