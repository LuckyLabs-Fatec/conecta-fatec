'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { BookOpen, LucideIcon, Users } from 'lucide-react';

type AdminSection = 'users' | 'courses';

interface AdminShellProps {
  activeSection: AdminSection;
  children: ReactNode;
}

const adminSections: Array<{
  id: AdminSection;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}> = [
  {
    id: 'users',
    label: 'Usuários',
    description: 'Perfis e permissões',
    href: '/admin/usuarios',
    icon: Users,
  },
  {
    id: 'courses',
    label: 'Cursos',
    description: 'Cursos cadastrados',
    href: '/admin/cursos',
    icon: BookOpen,
  },
];

export function AdminShell({ activeSection, children }: AdminShellProps) {
  return (
    <main className="min-h-screen bg-[var(--cps-silver-base)] py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--cps-blue-base)] mb-2">
            Administração
          </h1>
          <p className="text-[var(--cps-gray-text)]">
            Gerencie as áreas administrativas do Fatec Conecta
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit border border-[var(--cps-gray-light)] bg-white shadow-[var(--cps-shadow-1)]">
            <nav className="p-3" aria-label="Menu administrativo">
              {adminSections.map((section) => {
                const isActive = section.id === activeSection;
                const Icon = section.icon;

                return (
                  <Link
                    key={section.id}
                    href={section.href}
                    className={`flex w-full items-center gap-3 px-3 py-3 text-left transition-colors ${
                      isActive
                        ? 'bg-[var(--cps-feedback-cancelled-light)] text-[var(--cps-red-base)]'
                        : 'text-[var(--cps-gray-text)] hover:bg-[var(--cps-silver-base)]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={20} aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-semibold">
                        {section.label}
                      </span>
                      <span className="block text-xs text-[var(--cps-gray-text)]">
                        {section.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <section>{children}</section>
        </div>
      </div>
    </main>
  );
}
