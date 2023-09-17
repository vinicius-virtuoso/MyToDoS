import { Loader2 } from "lucide-react";

interface SubmitProps {
  text: string;
  textLoading: string;
  isSubmitting: boolean;
}

export const Submit = ({
  isSubmitting = false,
  text,
  textLoading,
}: SubmitProps) => {
  return (
    <button
      type="submit"
      className="w-full h-12 rounded-md bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-100 font-bold"
      disabled={isSubmitting}
    >
      {!isSubmitting ? (
        <span>{text}</span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="animate-spin" strokeWidth={3} />
          {textLoading}
        </span>
      )}
    </button>
  );
};
