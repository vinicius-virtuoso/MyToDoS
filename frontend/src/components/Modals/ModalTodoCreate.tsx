"use client";

import { useAuth } from "@/context/AuthProvider";
import { useModalCreate } from "@/context/ModalCreateProvider";
import { api } from "@/services/client";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FormDataProps {
  title: string;
  description: string;
}

interface ModalTodoCreateProps {
  onRefetch: () => Promise<void>;
}

export const ModalTodoCreate = ({ onRefetch }: ModalTodoCreateProps) => {
  const { token, logout } = useAuth();
  const { closeModalCreate } = useModalCreate();
  const [errorTitle, setErrorTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    title: z.string().nonempty("Titulo não pode estar vazio!"),
    description: z.string().nonempty("Descrição não pode estar vazio!"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: zodResolver(formSchema),
  });

  const handleClickInsideModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const onSubmit = (formData: FormDataProps) => {
    setIsLoading(true);
    api
      .post(
        "/todos",
        { ...formData },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then(() => {
        onRefetch();
        setIsLoading(false);
        reset();
        closeModalCreate();
      })
      .catch(({ response }) => {
        setIsLoading(false);
        if (response.status === 409) {
          setErrorTitle(true);
        }
        if (response.status === 401) {
          logout();
        }
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closeModalCreate}
      className="fixed bg-black/70 z-[99] top-0 bottom-0 left-0 right-0 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="relative overflow-hidden w-11/12 sm:w-full max-w-md md:w-[500px] h-auto min-h-[380px] flex flex-col bg-zinc-100 dark:bg-zinc-900 p-4 md:p-8 rounded-md border border-zinc-900"
        onClick={handleClickInsideModal}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl text-blue-600 font-bold">
            Nova tarefa
          </h3>

          <button
            className="text-lg"
            onClick={closeModalCreate}
            title="Fechar"
            aria-label="Fechar menu"
          >
            <X className="w-full h-full hover:scale-125 transition-transform" />
          </button>
        </div>

        <form className="mt-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full">
            <label htmlFor="title">Titulo:</label>
            <input
              id="title"
              type="text"
              className={clsx(
                "w-full rounded-md border-2 dark:border-zinc-700 outline-none p-3 dark:bg-blue-800/5 focus:border-zinc-950 transition-all",
                { "border-red-500": errors.title || errorTitle }
              )}
              {...register("title")}
            />
            {errorTitle && (
              <span className="text-sm text-red-500">Tarefa já existe.</span>
            )}
            {errors.title && (
              <span className="text-sm text-red-500">
                {errors.title.message}
              </span>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="desc">Descrição:</label>
            <textarea
              id="desc"
              className="w-full resize-none h-20 rounded-md border-2 dark:border-zinc-700 outline-none p-3 dark:bg-blue-800/5 focus:border-zinc-950 transition-all"
              {...register("description")}
            ></textarea>
            {errors.description && (
              <span className="text-sm text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>
          <div className="flex items-center justify-end">
            <button className="hover:bg-blue-700 hover:text-white transition-colors flex items-center justify-center gap-2 bg-blue-600/10 border border-blue-500 rounded-md py-2 px-3">
              {isLoading ? (
                <>
                  Criando...
                  <Loader2 className="animate-spin" size={14} strokeWidth={3} />
                </>
              ) : (
                "Criar tarefa"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
