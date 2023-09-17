import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MyTodo - Se organize agora!",
  description:
    "Crie sua conta ou faça o login - Se organize e conclua suas tarefas de modo ágil!",
};

export default function Home() {
  return (
    <>
      <div className="w-full flex items-center justify-center h-full">
        <h1 className="text-6xl font-bold">Home</h1>
      </div>
    </>
  );
}
