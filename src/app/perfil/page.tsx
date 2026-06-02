"use client";
import Image from "next/image";
import { User } from 'lucide-react';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header, useToast, MaskedInput, type MaskConfig } from "@/presentation/components";
import http from '@/presentation/lib/http';
import { useAuth } from "@/presentation/hooks/useAuth";

const phoneMaskConfig: MaskConfig = {
  pattern: (value: string) => {
    return value.length <= 10 ? '(xx) xxxx-xxxx' : '(xx) xxxxx-xxxx';
  },
  charRegex: /^\d{0,11}$/,
  placeholder: '(11) 99999-9999'
};

export default function PerfilPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { show } = useToast();
  const [avatarError, setAvatarError] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editingAvatar, setEditingAvatar] = useState<string | null>(null);
  const [editingPhone, setEditingPhone] = useState<string | null>(null);
  const [editingPhoneIsWhatsapp, setEditingPhoneIsWhatsapp] = useState<boolean | null>(null);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/autenticacao");
    }
  }, [isLoading, isAuthenticated, router]);

  const editingNameValue = editingName ?? user?.user_metadata.name ?? '';
  const editingAvatarValue = editingAvatar ?? user?.user_metadata.avatar ?? '';
  const editingPhoneValue = editingPhone ?? user?.user_metadata.phone ?? '';
  const editingPhoneIsWhatsappValue = editingPhoneIsWhatsapp ?? user?.user_metadata.phone_is_whats ?? false;
  const editingRoleValue = editingRole ?? user?.user_metadata.role ?? '';

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const onCopyEmail = async () => {
    if (!user.email) {
      show({ kind: "error", message: "E-mail não disponível para cópia." });
      return;
    }
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

  const onSave = async () => {
    setIsSaving(true);
    try {
      await http.put(`/api/user-profile/${user?.id as string}`, {
        name: editingNameValue,
        avatar: editingAvatarValue,
        phone: editingPhoneValue,
        phone_is_whats: editingPhoneIsWhatsappValue,
        role: editingRoleValue,
      });

      show({ kind: 'success', message: 'Perfil atualizado com sucesso!' });
    } catch (error: unknown) {
      const err = error as Error;
      show({ kind: 'error', message: err.message || 'Erro ao atualizar perfil.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-black">
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

          <section className="bg-white border rounded-[30px] shadow-[var(--cps-shadow-1)] p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              {user.user_metadata.avatar && !avatarError ? (
                <Image
                  src={user.user_metadata.avatar}
                  alt={`Avatar de ${user.user_metadata.name ?? 'Usuário'}`}
                  width={96}
                  height={96}
                  className="rounded-full border"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[var(--cps-gray-hover)] flex items-center justify-center border">
                  <User size={40} className="text-[var(--cps-gray-text)]" />
                </div>
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <label htmlFor="name" className="text-xs text-[var(--cps-gray-text)]">Nome</label>
                <input
                  id="name"
                  value={editingNameValue}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-[30px]"
                />
              </div>
              <div className="md:col-span-1">
                <span className="text-xs text-[var(--cps-gray-text)]">E-mail</span>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-medium text-[var(--cps-blue-base)] break-all">{user.email}</span>
                  <button onClick={onCopyEmail} className="text-sm text-[var(--cps-red-base)] hover:underline">Copiar</button>
                </div>
              </div>

              <div className="md:col-span-1">
                <MaskedInput
                  label="Telefone"
                  id="phone"
                  value={editingPhoneValue}
                  onChange={(e) => setEditingPhone(e.target.value)}
                  maskConfig={phoneMaskConfig}
                />
              </div>
              <div className="md:col-span-1 flex items-center mt-6">
                <input
                  type="checkbox"
                  id="phoneIsWhatsapp"
                  checked={editingPhoneIsWhatsappValue}
                  onChange={(e) => setEditingPhoneIsWhatsapp(e.target.checked)}
                  className="h-4 w-4 text-[var(--cps-red-base)] focus:ring-[var(--cps-blue-highlight)] border-[var(--cps-gray-light)] rounded"
                />
                <label htmlFor="phoneIsWhatsapp" className="ml-2 text-sm text-[var(--cps-gray-text)]">WhatsApp</label>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="role" className="text-xs text-[var(--cps-gray-text)]">Perfil(PROVISÓRIO)</label>
                <select
                  id="role"
                  value={editingRoleValue}
                  onChange={(e) => setEditingRole(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-[30px] bg-white"
                >
                  <option value="comunidade">Comunidade</option>
                  <option value="estudante">Estudante</option>
                  <option value="mediador">Mediador</option>
                  <option value="coordenador">Coordenação</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="avatar" className="text-xs text-[var(--cps-gray-text)]">URL do Avatar</label>
                <input
                  id="avatar"
                  value={editingAvatarValue}
                  onChange={(e) => setEditingAvatar(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full px-3 py-2 border rounded-[30px]"
                />
              </div>
              {user.department && <Info label="Departamento" value={user.department} />}
              {user.specialization && <Info label="Especialização" value={user.specialization} />}
            </div>
          </section>

          <div className="mt-4 flex gap-3">
            <button onClick={onSave} disabled={isSaving} className="rounded px-4 py-2 bg-[var(--palette-red-600)] text-white hover:bg-[var(--palette-red-700)] disabled:opacity-50 disabled:cursor-not-allowed">
              {isSaving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>

          <section className="mt-8 bg-white border rounded-[30px] shadow-[var(--cps-shadow-1)] p-6">
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

          <div className="mt-6 text-sm text-[var(--cps-gray-text)]">
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
      <span className="text-xs text-[var(--cps-gray-text)]">{label}</span>
      <span className="font-medium text-[var(--cps-blue-base)]">{value}</span>
    </div>
  );
}
