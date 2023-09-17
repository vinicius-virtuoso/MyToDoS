"use client";

import React, { ReactNode, createContext, useContext, useState } from "react";

interface ContextProps {
  page: number;
  nextPage: () => void;
  prevPage: () => void;
  haveNextPage: boolean;
  havePrevPage: boolean;
  setHaveNextPage: React.Dispatch<React.SetStateAction<boolean>>;
  setHavePrevPage: React.Dispatch<React.SetStateAction<boolean>>;
  perPage: number;
}

interface PaginationProviderProps {
  children: ReactNode;
}

const PaginationContext = createContext<ContextProps>({} as ContextProps);

export const PaginationProvider = ({ children }: PaginationProviderProps) => {
  const [page, setPage] = useState<number>(1);
  const [haveNextPage, setHaveNextPage] = useState<boolean>(false);
  const [havePrevPage, setHavePrevPage] = useState<boolean>(false);
  const perPage = 20;

  const nextPage = () => {
    if (haveNextPage) {
      setPage((page) => page + 1);
    }
  };

  const prevPage = () => {
    if (havePrevPage) {
      setPage((page) => page - 1);
    }
  };

  return (
    <PaginationContext.Provider
      value={{
        setHavePrevPage,
        setHaveNextPage,
        page,
        nextPage,
        prevPage,
        haveNextPage,
        havePrevPage,
        perPage,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = () => useContext(PaginationContext);
