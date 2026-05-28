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
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Administração
          </h1>
          <p className="text-gray-600">
            Gerencie as áreas administrativas do Fatec Conecta
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit border border-gray-200 bg-white shadow-sm">
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
                        ? 'bg-red-50 text-[#CB2616]'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={20} aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-semibold">
                        {section.label}
                      </span>
                      <span className="block text-xs text-gray-500">
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
