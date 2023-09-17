"use client";

import { motion } from "framer-motion";
import { Ban, Edit, Loader2, ThumbsUp, Trash, X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { api } from "@/services/client";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";

interface TodoProps {
  id: number;
  title: string;
  description: string;
  complete: boolean;
  dateCompleted: string | null;
  created_at: string;
}

interface ModalTodoProps {
  todo: TodoProps;
  checkTodo: (todo_id: number) => void;
  closeModal: () => void;
  todos: TodoProps[];
  onRefetch: () => Promise<void>;
}

export const ModalTodo = ({ todo, closeModal, onRefetch }: ModalTodoProps) => {
  const { token } = useAuth();

  const [updatable, setUpdatable] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [complete, setComplete] = useState(todo.complete);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [confirmeDelete, setConfirmeDelete] = useState(false);

  const date = todo.dateCompleted
    ? new Date(todo.dateCompleted).toLocaleDateString()
    : todo.dateCompleted;

  const handleClickInsideModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const onEdit = () => {
    setUpdatable(true);
  };

  const cancelEdit = () => {
    setTitle(todo.title);
    setDescription(todo.description);
    setComplete(todo.complete);
    setUpdatable(false);
  };

  const onUpdate = () => {
    setIsLoading(true);
    api
      .patch(
        `/todos/${todo.id}`,
        {
          ...todo,
          title,
          description,
          complete,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(() => {
        onRefetch();
        setIsLoading(false);
        closeModal();
      })
      .catch(({ response }) => {
        setIsLoading(false);
        if (response.status === 409) {
          setError(true);
        }
      });
  };

  const onDelete = () => {
    setIsLoading(true);
    api
      .delete(`/todos/${todo.id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(() => {
        onRefetch();
        setIsLoading(false);
        closeModal();
      })
      .catch(({ response }) => {
        setIsLoading(false);
        if (response.status === 401) {
          setError(true);
          toast.error("Sessão expirada.", {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key={todo.id}
      className="fixed bg-black/40 z-[99] top-0 bottom-0 left-0 right-0 flex items-center justify-center"
      onClick={closeModal}
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
            Detalhes da tarefa
          </h3>

          <button
            className="text-lg"
            onClick={closeModal}
            title="Fechar"
            aria-label="Fechar menu"
          >
            <X className="w-full h-full hover:scale-125 transition-transform" />
          </button>
        </div>

        <div className="mt-3">
          <div className="w-full space-y-4">
            <div className="w-full">
              <label htmlFor="title">Titulo:</label>
              <input
                id="title"
                type="text"
                disabled={!updatable}
                onChange={({ target }) => setTitle(target.value)}
                value={title}
                className={clsx(
                  "w-full rounded-md border-2 dark:border-zinc-700 outline-none p-3 dark:bg-blue-800/5 focus:border-zinc-950 transition-all",
                  { "border-red-500": error }
                )}
              />
              {error && (
                <span className="text-sm text-red-500">
                  Tarefa já cadastrada.
                </span>
              )}
            </div>
            <div className="w-full">
              <label htmlFor="desc">Descrição:</label>
              <textarea
                name="description"
                id="desc"
                className="w-full resize-none h-20 rounded-md border-2 dark:border-zinc-700 outline-none p-3 dark:bg-blue-800/5 focus:border-zinc-950 transition-all"
                disabled={!updatable}
                onChange={({ target }) => setDescription(target.value)}
                value={description}
              ></textarea>
            </div>
            <div className="w-full flex items-center justify-between gap-3">
              <label
                htmlFor="yes"
                className={clsx(
                  "w-full border text-xs md:text-base text-center p-3 bg-green-600/10 border-green-500 rounded-md cursor-pointer",
                  {
                    "opacity-25": !complete,
                  }
                )}
              >
                Completado
              </label>
              <label
                htmlFor="not"
                className={clsx(
                  "w-full border text-xs md:text-base text-center p-3 bg-red-600/10 border-red-500 rounded-md cursor-pointer",
                  {
                    "opacity-25": complete,
                  }
                )}
              >
                Não completado
              </label>
              <input
                type="checkbox"
                id="yes"
                className="sr-only"
                disabled={!updatable}
                checked={complete}
                onClick={() => setComplete(true)}
              />

              <input
                type="checkbox"
                id="not"
                className="sr-only"
                disabled={!updatable}
                checked={!complete}
                onClick={() => setComplete(false)}
              />
            </div>
            {todo.complete && <p className="text-sm">Completado em: {date}</p>}
          </div>
        </div>
        <footer className="py-4 mt-4 border-t w-full border-zinc-800/20">
          {!updatable ? (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setConfirmeDelete(true)}
                className="hover:bg-red-700 hover:text-white transition-colors flex items-center justify-center gap-2 bg-red-600/10 border border-red-500 rounded-md py-2 px-3"
              >
                {!isLoading ? (
                  <>
                    Excluir <Trash size={14} />
                  </>
                ) : (
                  <>
                    Excluindo...
                    <Loader2
                      className="animate-spin"
                      size={14}
                      strokeWidth={3}
                    />
                  </>
                )}
              </button>
              <button
                onClick={onEdit}
                className="hover:bg-amber-700 hover:text-white transition-colors flex items-center justify-center gap-2 bg-amber-600/20 border border-amber-500 rounded-md py-2 px-3"
              >
                Editar <Edit size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={cancelEdit}
                className="hover:bg-red-700 hover:text-white transition-colors flex items-center justify-center gap-2 bg-red-600/10 border border-red-500 rounded-md py-2 px-3"
              >
                Cancelar <Ban size={14} />
              </button>
              <button
                onClick={onUpdate}
                className="hover:bg-green-700 hover:text-white transition-colors flex items-center justify-center gap-2 bg-green-600/10 border border-green-500 rounded-md py-2 px-3"
              >
                {!isLoading ? (
                  <>
                    Editar <ThumbsUp size={14} />
                  </>
                ) : (
                  <>
                    Editando...
                    <Loader2
                      className="animate-spin"
                      size={14}
                      strokeWidth={3}
                    />
                  </>
                )}
              </button>
            </div>
          )}
        </footer>
        {confirmeDelete && (
          <div className="p-4 absolute top-0 left-0 z-50 w-full h-full bg-white dark:bg-zinc-900 flex items-center justify-center flex-col gap-4">
            <div className="w-[80%] text-center h-20">
              <h4 className="text-base md:text-xl font-bold text-red-500">
                Deseja realmente apagar esta tarefa?
              </h4>
              <span className="text-xs md:text-sm text-zinc-500">
                Está é uma ação irreversível.
              </span>
            </div>
            <div className="flex items-center justify-center gap-4 w-full">
              <button
                onClick={() => setConfirmeDelete(false)}
                className="hover:bg-blue-700 hover:text-white transition-colors flex items-center justify-center gap-2 bg-blue-600/10 border border-blue-500 rounded-md py-2 px-3"
              >
                Não
              </button>
              <button
                onClick={onDelete}
                className="hover:bg-red-700 hover:text-white transition-colors flex items-center justify-center gap-2 bg-red-600/10 border border-red-500 rounded-md py-2 px-3"
              >
                {!isLoading ? (
                  "Continuar"
                ) : (
                  <>
                    Excluindo...
                    <Loader2
                      className="animate-spin"
                      size={14}
                      strokeWidth={3}
                    />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
