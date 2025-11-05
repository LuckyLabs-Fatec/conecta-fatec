"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header, useToast } from "@/presentation/components";
import { useAuth } from "@/presentation/hooks/useAuth";

export default function ConfiguracoesPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  const { show } = useToast();
  const [largeFont, setLargeFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/autenticacao");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLargeFont(document.body.classList.contains("a11y-large-font"));
      setHighContrast(document.body.classList.contains("a11y-high-contrast"));
    }
  }, []);

  if (isLoading || !isAuthenticated) return null;

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
    show({ kind: "info", message: next ? "Fonte grande ativada" : "Fonte grande desativada" });
  };

  const onToggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    applyA11y("a11y-high-contrast", next);
    show({ kind: "info", message: next ? "Alto contraste ativado" : "Alto contraste desativado" });
  };

  const restoreDefaults = () => {
    setLargeFont(false);
    setHighContrast(false);
    applyA11y("a11y-large-font", false);
    applyA11y("a11y-high-contrast", false);
    show({ kind: "success", message: "Preferências restauradas." });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-black">
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Configurações</h1>

          <section className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Acessibilidade</h2>
            <div className="flex flex-col gap-4">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={largeFont} onChange={onToggleLargeFont} />
                <span>Fonte grande</span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={highContrast} onChange={onToggleHighContrast} />
                <span>Alto contraste</span>
              </label>
            </div>

            <div className="mt-6">
              <button
                onClick={restoreDefaults}
                className="rounded px-4 py-2 border border-gray-300 hover:bg-gray-50"
              >
                Restaurar padrão
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
