"use client";

import { ReactNode, createContext, useContext, useState } from "react";

interface ModalEditContextProps {
  activeTodo: TodoProps | null;
  showModal: boolean;
  openModal: (todo: TodoProps) => void;
  closeModal: () => void;
}

interface ModalProviderProps {
  children: ReactNode;
}

interface TodoProps {
  id: number;
  title: string;
  description: string;
  complete: boolean;
  dateCompleted: string | null;
  created_at: string;
}

const ModalEditContext = createContext({} as ModalEditContextProps);

export const ModalEditProvider = ({ children }: ModalProviderProps) => {
  const [activeTodo, setActiveTodo] = useState<TodoProps | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (todo: TodoProps) => {
    setActiveTodo(todo);
    setShowModal(true);
  };

  const closeModal = () => {
    setActiveTodo(null);
    setShowModal(false);
  };

  return (
    <ModalEditContext.Provider
      value={{ activeTodo, showModal, openModal, closeModal }}
    >
      {children}
    </ModalEditContext.Provider>
  );
};

export const useModalEdit = () => useContext(ModalEditContext);
