"use client";

import "dotenv/config";
import { redirect, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { Input } from "../Input";
import { Submit } from "../Submit";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { AxiosError } from "axios";
import { useState } from "react";

interface FormDataProps {
  email: string;
  password: string;
}

export const FormLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useRouter();

  const formSchema = z.object({
    email: z
      .string()
      .nonempty("Email não pode estar vazio!")
      .email("Email é invalido!"),
    password: z
      .string()
      .nonempty("Senha não pode estar vazio!")
      .min(4, "Senha muito curta"),
  });

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (formData: FormDataProps) => {
    setIsLoading(true);
    login({ email: formData.email, password: formData.password })
      .then(() => {
        setIsLoading(false);
        navigate.push("/dashboard");
      })
      .catch(({ response }: AxiosError) => {
        setIsLoading(false);
        if (response?.status === 401) {
          toast.error("Credenciais estão incorretas.", {
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
          setFocus("email");
        }
        if (response?.status === 404) {
          toast.error("Conta não existente.", {
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
          setFocus("email");
        }
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="w-full space-y-4">
        <div className="w-full h-full flex items-center justify-center gap-4 flex-col">
          <Input error={errors.email} label="Email" {...register("email")} />
          <Input
            error={errors.password}
            label="Senha"
            type="password"
            {...register("password")}
          />
        </div>
        <Submit
          isSubmitting={isLoading}
          text="Entrar"
          textLoading="Logando..."
        />
      </div>
      <Link
        href="/register"
        className="dark:text-zinc-200 w-full text-center flex items-center justify-center mt-4 gap-2 text-sm"
      >
        Ainda não tem uma conta?
        <span className="text-blue-500">Registre-se.</span>
      </Link>
    </form>
  );
};
