import { useModalCreate } from "@/context/ModalCreateProvider";
import { Plus } from "lucide-react";

export const AddTodo = () => {
  const { openModalCreate } = useModalCreate();

  return (
    <>
      <button
        onClick={openModalCreate}
        className="hover:rounded-md active:rounded-md transition-all z-50 fixed md:static bottom-3 right-3 md:bottom-20 md:right-9  w-auto h-14 rounded-full md:rounded-md md:w-auto px-4 py-2 text-xl font-semibold shadow-md flex items-center gap-3 justify-center text-white bg-blue-600 hover:bg-blue-800"
      >
        <span className="w-full hidden md:block">Criar tarefa</span>
        <span>
          <Plus strokeWidth={3} size={24} />
        </span>
      </button>
    </>
  );
};
