"use client";

import clsx from "clsx";
import { Check } from "lucide-react";

import { motion } from "framer-motion";

const item = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

interface TodoProps {
  todo: {
    id: number;
    title: string;
    description: string;
    complete: boolean;
    dateCompleted: string | null;
    created_at: string;
  };
  checkTodo: (todo_id: number) => void;
}

export const TodoCard = ({ todo, checkTodo }: TodoProps) => {
  const date =
    todo.dateCompleted && new Date(todo.dateCompleted).toLocaleDateString();
  const formatTitle =
    todo.title.length > 30
      ? todo.title.substring(0, 20).concat("...")
      : todo.title;

  return (
    <>
      <motion.div
        layout
        variants={item}
        className={clsx(
          "p-4 relative w-full h-24 flex items-center overflow-hidden justify-between shadow-xl shadow-black/30 hover:drop-shadow-md cursor-pointer border rounded-lg",
          {
            "hover:bg-red-700/5 bg-red-950/10 dark:bg-red-950/5 dark:text-gray-200 border-red-700/50":
              todo.complete === false,
          },
          {
            "hover:bg-blue-700/5 bg-blue-950/10 dark:bg-blue-950/5 dark:text-gray-200 border-blue-700/50":
              todo.complete === true,
          }
        )}
      >
        <div>
          <h2 className="font-bold tracking-wider">{formatTitle}</h2>
          <span className="text-sm text-zinc-600">
            {todo.complete ? (
              <span>
                <span className="text-green-600">Completado: </span>{" "}
                <span>{date}</span>
              </span>
            ) : (
              "Não completado!"
            )}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              checkTodo(todo.id);
            }}
            className={clsx(
              "rounded-md transition-all p-1 w-8 h-8 flax items-center justify-center hover:scale-150",
              {
                "text-green-600 bg-green-700/10": todo.complete,
                "text-red-600 bg-red-700/10": !todo.complete,
              }
            )}
          >
            {todo.complete && (
              <div title="Completa">
                <Check strokeWidth={3} />
              </div>
            )}
          </button>
        </div>
        <div className="absolute bottom-0 left-0 z-10 w-full h-1">
          <div
            className={clsx(
              "h-full transition-all",
              { "w-full bg-blue-500": todo.complete === true },
              { "w-1/6 bg-red-500 h-full": todo.complete === false }
            )}
          ></div>
        </div>
      </motion.div>
    </>
  );
};
