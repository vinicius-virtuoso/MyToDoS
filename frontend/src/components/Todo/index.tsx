"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { Pagination } from "../Pagination";

import { TodoCard } from "./TodoCard";
import { useAuth } from "@/context/AuthProvider";
import { usePagination } from "@/context/PaginationProvider";
import { useState } from "react";
import { api } from "@/services/client";
import { useQuery, useMutation } from "react-query";
import { useModalEdit } from "@/context/ModalEditProvider";
import { ModalTodo } from "../Modals/ModalTodo";
import { MenuTodo } from "./MenuTodo";
import { ModalTodoCreate } from "../Modals/ModalTodoCreate";
import { useModalCreate } from "@/context/ModalCreateProvider";
import toast from "react-hot-toast";

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

interface TodoProps {
  id: number;
  title: string;
  description: string;
  complete: boolean;
  dateCompleted: string | null;
  created_at: string;
}

interface ApiTodosProps {
  data: {
    nextPage: string | null;
    prevPage: string | null;
    count: number;
    data: TodoProps[];
  };
}

export const Todo = () => {
  const { token, logout } = useAuth();
  const [todos, setTodos] = useState<TodoProps[]>([]);
  const { page, perPage, setHaveNextPage, setHavePrevPage } = usePagination();
  const [active, setActive] = useState("all");
  const { openModal, activeTodo, showModal, closeModal } = useModalEdit();
  const [isLoading, setIsLoading] = useState(true);
  const { showModalCreate } = useModalCreate();

  const { refetch } = useQuery(
    ["todos", page, active, todos],
    async () => {
      return await api.get(
        `/todos?page=${page}&perPage=${perPage}&filter=${active}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    {
      retry: 1,
      keepPreviousData: true,
      cacheTime: 60 * 60 * 24,
      onSuccess: ({ data }: ApiTodosProps) => {
        setTodos(data.data);
        setIsLoading(false);
        setHaveNextPage(data.nextPage ? true : false);
        setHavePrevPage(data.prevPage ? true : false);
      },
      onError: () => {
        setIsLoading(false);
        logout();
        toast.error("Sessão expirada!", {
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
      },
    }
  );

  const mutationCheck = useMutation({
    mutationFn: async (todo_id: number) => {
      return await api.patch(`/todos/${todo_id}/complete`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      refetch();
    },
    onError: () => {
      logout();
    },
  });

  const checkTodo = async (todo_id: number) => {
    mutationCheck.mutate(todo_id);
  };

  const onRefetch = async () => {
    await refetch();
  };

  const changeFilter = (filter: "all" | "complete" | "not-completed") => {
    setActive(filter);
  };

  return (
    <>
      {!isLoading ? (
        <div className="h-full w-full grid grid-rows-[minmax(4rem,5rem),1fr]">
          <MenuTodo active={active} changeFilter={changeFilter} />
          {todos.length > 0 ? (
            <>
              <AnimatePresence>
                <div className="w-full md:p-4">
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    layout
                    className="w-full px-4 gap-2 md:gap-4 flex-col grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 grid-rows-4"
                  >
                    {todos.map((todo) => (
                      <div
                        key={todo.id}
                        onClick={() => openModal(todo)}
                        className="w-full"
                      >
                        <TodoCard todo={todo} checkTodo={checkTodo} />
                      </div>
                    ))}
                  </motion.div>
                </div>
              </AnimatePresence>
              <Pagination />
            </>
          ) : (
            <div className="flex flex-col gap-3 items-center justify-center w-full h-full">
              <h2 className="md:text-4xl">Não tem nada aqui!</h2>
              <p className="md:text-2xl opacity-50">Crie suas tarefas.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="animate-spin" size={50} strokeWidth={3} />
        </div>
      )}
      <AnimatePresence>
        {activeTodo && showModal && (
          <ModalTodo
            onRefetch={onRefetch}
            todos={todos}
            todo={activeTodo}
            checkTodo={checkTodo}
            closeModal={closeModal}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showModalCreate && <ModalTodoCreate onRefetch={onRefetch} />}
      </AnimatePresence>
    </>
  );
};
