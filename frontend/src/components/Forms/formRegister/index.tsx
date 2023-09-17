"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { Input } from "../Input";
import { Submit } from "../Submit";
import { api } from "@/services/client";
import { useState } from "react";

interface FormDataProps {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export const FormRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useRouter();

  const formSchema = z
    .object({
      name: z.string().nonempty("Nome não pode estar vazio!"),
      email: z
        .string()
        .nonempty("Email não pode estar vazio!")
        .email("Email é invalido!"),
      password: z
        .string()
        .nonempty("Senha não pode estar vazio!")
        .min(4, "Senha muito curta"),
      passwordConfirm: z
        .string()
        .nonempty("É necessário confirmar a senha!")
        .min(4, "Senha muito curta"),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "As senhas não são iguais!",
      path: ["passwordConfirm"],
    });
  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (formData: FormDataProps) => {
    setIsLoading(true);
    api
      .post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      .then(() => {
        toast.success("Conta criada com sucesso!", {
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
        navigate.push("/login");
      })
      .catch(({ response }) => {
        setIsLoading(false);
        if (response.status === 409) {
          toast.error("Email já cadastrado", {
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
          <Input error={errors.name} label="Nome" {...register("name")} />
          <Input error={errors.email} label="Email" {...register("email")} />
          <Input
            error={errors.password}
            label="Senha"
            type="password"
            {...register("password")}
          />
          <Input
            error={errors.passwordConfirm}
            label="Confirme a senha"
            type="password"
            {...register("passwordConfirm")}
          />
        </div>
        <Submit
          isSubmitting={isLoading}
          text="Criar conta!"
          textLoading="Criando..."
        />
      </div>
      <Link
        href="/login"
        className="dark:text-zinc-200 w-full text-center flex items-center justify-center mt-4 gap-2 text-sm"
      >
        ja tenho conta quero fazer o
        <span className="text-blue-500">Login.</span>
      </Link>
    </form>
  );
};
