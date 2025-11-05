"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header, useToast } from "@/presentation/components";
import { useAuth } from "@/presentation/hooks/useAuth";

export default function PerfilPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, updateUser } = useAuth();
  const { show } = useToast();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [largeFont, setLargeFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/autenticacao");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setAvatar(user.avatar ?? "");
    }
    if (typeof window !== "undefined") {
      setLargeFont(document.body.classList.contains("a11y-large-font"));
      setHighContrast(document.body.classList.contains("a11y-high-contrast"));
    }
  }, [user]);

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const roleLabel: Record<string, string> = {
    comunidade: "Comunidade",
    mediador: "Mediador",
    coordenacao: "Coordenação",
  };

  const formattedLoginTime = (() => {
    try {
      return new Date(user.loginTime).toLocaleString();
    } catch {
      return user.loginTime;
    }
  })();

  const onSave = () => {
    updateUser({ name, avatar });
    show({ kind: "success", message: "Perfil atualizado." });
  };

  const onCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(user.email);
      show({ kind: "success", message: "E-mail copiado para a área de transferência." });
    } catch {
      show({ kind: "error", message: "Não foi possível copiar o e-mail." });
    }
  };

  const applyA11y = (key: "a11y-large-font" | "a11y-high-contrast", on: boolean) => {
    const cls = key;
    if (on) {
      document.body.classList.add(cls);
      localStorage.setItem(cls, "1");
    } else {
      document.body.classList.remove(cls);
      localStorage.removeItem(cls);
    }
  };

  const onToggleLargeFont = () => {
    const next = !largeFont;
    setLargeFont(next);
    applyA11y("a11y-large-font", next);
  };

  const onToggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    applyA11y("a11y-high-contrast", next);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-black">
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

          <section className="bg-white border rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Image
                src={user.avatar}
                alt={`Avatar de ${user.name}`}
                width={96}
                height={96}
                className="rounded-full border"
              />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <label htmlFor="name" className="text-xs text-gray-500">Nome</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="md:col-span-1">
                <span className="text-xs text-gray-500">E-mail</span>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-medium text-gray-900 break-all">{user.email}</span>
                  <button onClick={onCopyEmail} className="text-sm text-[#CB2616] hover:underline">Copiar</button>
                </div>
              </div>
              <Info label="Perfil" value={roleLabel[user.role] ?? user.role} />
              <Info label="Login" value={formattedLoginTime} />
              <div className="md:col-span-2">
                <label htmlFor="avatar" className="text-xs text-gray-500">URL do Avatar</label>
                <input
                  id="avatar"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              {user.department && <Info label="Departamento" value={user.department} />}
              {user.specialization && <Info label="Especialização" value={user.specialization} />}
            </div>
          </section>

          <div className="mt-4 flex gap-3">
            <button onClick={onSave} className="rounded px-4 py-2 bg-[var(--palette-red-600)] text-white hover:bg-[var(--palette-red-700)]">
              Salvar alterações
            </button>
          </div>

          <section className="mt-8 bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Acessibilidade</h2>
            <div className="flex flex-col gap-3">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={largeFont} onChange={onToggleLargeFont} />
                <span>Fonte grande</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={highContrast} onChange={onToggleHighContrast} />
                <span>Alto contraste</span>
              </label>
            </div>
          </section>

          <div className="mt-6 text-sm text-gray-600">
            Seus dados são armazenados localmente para fins de demonstração deste protótipo.
          </div>
        </div>
      </main>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
