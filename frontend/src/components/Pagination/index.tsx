"use client";

import { usePagination } from "@/context/PaginationProvider";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const Pagination = () => {
  const { page, nextPage, prevPage, haveNextPage, havePrevPage } =
    usePagination();

  console.log(haveNextPage);

  return (
    <>
      {haveNextPage && (
        <div className="w-full flex items-center justify-center gap-4 pb-4 md:pb-0 md:my-8 mb-24 mt-4 md:mt-2">
          <button
            disabled={!havePrevPage}
            onClick={prevPage}
            className="text-center flex items-center justify-center w-12 h-12 rounded-md transition-transform hover:scale-150"
          >
            {havePrevPage && <ArrowLeft />}
          </button>

          <span className="pointer-events-none text-center flex items-center justify-center border-2 dark:border-blue-600/50 bg-zinc-700 text-zinc-100 dark:bg-transparent w-12 h-12 rounded-md">
            {page}
          </span>

          <button
            disabled={!haveNextPage}
            onClick={nextPage}
            className="text-center flex items-center justify-center w-12 h-12 rounded-md transition-transform hover:scale-150"
          >
            {haveNextPage && <ArrowRight />}
          </button>
        </div>
      )}
    </>
  );
};
