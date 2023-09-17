"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import { PaginationProvider } from "./PaginationProvider";
import { UserProvider } from "./UserProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ModalEditProvider } from "./ModalEditProvider";
import { ModalCreateProvider } from "./ModalCreateProvider";
import { MenuAppProvider } from "./MenuAppProvider";
import { ThemeProvider } from "./ThemeProvider";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MenuAppProvider>
            <ModalCreateProvider>
              <ModalEditProvider>
                <UserProvider>
                  <PaginationProvider>{children}</PaginationProvider>
                </UserProvider>
              </ModalEditProvider>
            </ModalCreateProvider>
          </MenuAppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
