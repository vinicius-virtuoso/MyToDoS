"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface InputComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: {
    message?: string;
  };
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputComponentProps>(
  function MyInput(props, ref) {
    return (
      <label htmlFor={props.name} className="flex flex-col gap-1 w-full">
        <p>{props.label}</p>
        <input
          type="text"
          id={props.name}
          className={clsx(
            "disabled:opacity-50 w-full h-10 md:h-12 rounded-md border-2 outline-none px-3 dark:bg-blue-800/5 focus:border-zinc-950 transition-all disabled:border-gray-200",
            { "border-red-500": props.error?.message },
            { "border-blue-600": !props.error?.message }
          )}
          ref={ref}
          {...props}
        />
        {props.error && <p className="text-red-500">{props.error.message}</p>}
      </label>
    );
  }
);
