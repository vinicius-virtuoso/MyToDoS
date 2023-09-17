"use client";

import { api } from "@/services/client";
import Cookies from "js-cookie";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";
import toast from "react-hot-toast";

interface UserProps {
  id: number;
  name: string;
  email: string;
}

interface ContextProps {
  user: UserProps | null;
  updateUser: (dataUpdate: UserUpdateProps) => void;
  isLoading: boolean;

  deleteUser: () => Promise<void>;
  getUser: () => void;
}

interface UserProviderProps {
  children: ReactNode;
}

interface UserUpdateProps {
  name: string;
  email: string;
  password?: string;
}

const UserContext = createContext<ContextProps>({} as ContextProps);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const { logout, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const getUser = () => {
    setIsLoading(true);
    api
      .get("/profile", {
        headers: { Authorization: "Bearer " + token },
      })
      .then(({ data }) => {
        setIsLoading(false);
        setUser(data);
      })
      .catch(({ response }) => {
        setIsLoading(false);
        if (response.status === 401) {
          logout();
        }
      });
  };

  const updateUser = (dataUpdate: UserUpdateProps) => {
    api
      .patch(
        "/profile",
        { ...dataUpdate },
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then(() => {
        getUser();
        toast.success("Perfil Atualizado.", {
          position: "top-center",
          style: {
            color: "#dddd",
            backgroundColor: "#131313",
            fontFamily: "Arial",
            fontSize: "18px",
            width: "100%",
            maxWidth: "300px",
          },
        });
      })
      .catch(({ response }) => {
        console.log(response);
        if (response.status === 409) {
          toast.error("Email ja cadastrado.", {
            position: "top-center",
            style: {
              color: "#dddd",
              backgroundColor: "#131313",
              fontFamily: "Arial",
              fontSize: "18px",
              width: "100%",
              maxWidth: "300px",
            },
          });
        }
      });
  };

  const deleteUser = async () => {
    await api.delete("/profile", {
      headers: { Authorization: "Bearer " + token },
    });
    logout();
    toast.success("Saiu!", {
      position: "top-center",
      style: {
        color: "#dddd",
        backgroundColor: "#131313",
        fontFamily: "Arial",
        fontSize: "18px",
        width: "100%",
        maxWidth: "300px",
      },
    });
  };

  return (
    <UserContext.Provider
      value={{ user, isLoading, updateUser, deleteUser, getUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
