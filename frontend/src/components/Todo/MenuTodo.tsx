"use client";

import { clsx } from "clsx";
import { AddTodo } from "./AddTodo";

interface MenuTodoProps {
  active: string;
  changeFilter: (filter: "all" | "complete" | "not-completed") => void;
}

export const MenuTodo = ({ active, changeFilter }: MenuTodoProps) => {
  return (
    <div className="w-full flex items-center justify-between md:p-8 h-24">
      <div className="flex items-center justify-center gap-4 w-full md:w-auto">
        <button
          onClick={() => changeFilter("all")}
          className={clsx(
            "text-xs lg:text-lg w-1/3 sm:w-44 h-12 transition-all border-b-2",
            {
              "border-blue-600 text-blue-600 font-bold": active === "all",
            },
            {
              "border-b-transparent opacity-30": active !== "all",
            }
          )}
        >
          Todos
        </button>
        <button
          onClick={() => changeFilter("complete")}
          className={clsx(
            "text-xs lg:text-lg w-1/3 sm:w-44 h-12 transition-all border-b-2",
            {
              "border-blue-600 text-blue-600 font-bold": active === "complete",
            },
            {
              "border-b-transparent opacity-30": active !== "complete",
            }
          )}
        >
          Completados
        </button>
        <button
          onClick={() => changeFilter("not-completed")}
          className={clsx(
            "text-xs lg:text-lg w-1/3 sm:w-44 h-12 transition-all border-b-2",
            {
              "border-blue-600 text-blue-600 font-bold":
                active === "not-completed",
            },
            {
              "border-b-transparent opacity-30": active !== "not-completed",
            }
          )}
        >
          Não completados
        </button>
      </div>
      <AddTodo />
    </div>
  );
};
