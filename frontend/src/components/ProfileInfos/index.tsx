"use client";

import { useEffect, useState } from "react";
import { Input } from "../Forms/Input";
import { useUser } from "@/context/UserProvider";
import { Edit, Loader2, Save, X } from "lucide-react";

export const ProfileInfos = () => {
  const { user, updateUser, isLoading } = useUser();

  const [updatable, setUpdatable] = useState(false);
  const [fields, setFields] = useState(
    {
      name: user?.name || "",
      email: user?.email || "",
    } || {}
  );
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setFields({ name: user?.name, email: user?.email });
    }
  }, [user]);

  const onSubmit = () => {
    if (user) {
      if (password.trim()) {
        updateUser({
          name: fields.name.trim() ? fields.name : user.name,
          password,
          email:
            fields.email.trim() &&
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(fields.email)
              ? fields.email
              : user.email,
        });
      } else {
        updateUser({
          name: fields.name.trim() ? fields.name : user.name,
          email:
            fields.email.trim() &&
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(fields.email)
              ? fields.email
              : user.email,
        });
      }
    }
    onCancel();
  };

  const onEdit = () => {
    setUpdatable(true);
  };

  const onCancel = () => {
    setUpdatable(false);
    setFields({
      name: user?.name || "",
      email: user?.email || "",
    });
    setPassword("");
  };

  return (
    <div className="w-full max-w-md p-4 space-y-4">
      {user?.name && user?.email ? (
        <>
          <Input
            label="Nome"
            disabled={!updatable}
            value={fields.name}
            onChange={({ target }) =>
              setFields({ ...fields, name: target.value })
            }
          />

          <Input
            label="Email"
            disabled={!updatable}
            value={fields.email}
            onChange={({ target }) =>
              setFields({ ...fields, email: target.value })
            }
          />

          <Input
            label="Nova senha"
            type="password"
            disabled={!updatable}
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <div className="w-full flex justify-between">
            {updatable ? (
              <button
                onClick={onCancel}
                className="hover:bg-red-700 hover:text-white transition-colors flex items-center justify-center gap-2 bg-red-600/20 border border-red-500 rounded-md py-2 px-3"
              >
                Cancelar <X size={14} />
              </button>
            ) : (
              <div></div>
            )}
            {updatable ? (
              <button
                onClick={onSubmit}
                disabled={isLoading}
                className="hover:bg-green-700 hover:text-white transition-colors flex items-center justify-center gap-2 bg-green-600/20 border border-green-500 rounded-md py-2 px-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} /> Salvando...
                  </>
                ) : (
                  <>
                    Salvar <Save size={14} />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onEdit}
                className="hover:bg-amber-700 hover:text-white transition-colors flex items-center justify-center gap-2 bg-amber-600/20 border border-amber-500 rounded-md py-2 px-3"
              >
                Editar <Edit size={14} />
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="h-20 w-full flex item justify-center p-4">
          <Loader2 className="animate-spin" size={28} strokeWidth={3} />
        </div>
      )}
    </div>
  );
};
