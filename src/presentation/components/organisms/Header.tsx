'use client';
import Image from "next/image";
import { Button } from "../atoms/Button";
import Link from "next/link";
import { useAuth } from "@/presentation/hooks/useAuth";
import { ChevronDown, User, LogOut, Settings, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const Header = () => {
  const { user, logout, isAuthenticated, hasPermission } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isCommunityUser = (user?.user_metadata?.role ?? user?.role ?? '').toLowerCase() === 'comunidade';
  const navigationLinks = [
    isAuthenticated && isCommunityUser
      ? { href: '/submeter-proposta', label: 'Submeter Proposta' }
      : null,
    isAuthenticated && isCommunityUser
      ? { href: '/minhas-propostas', label: 'Minhas Propostas' }
      : null,
    isAuthenticated && hasPermission('mediador')
      ? { href: '/acompanhar-projetos', label: 'Acompanhar Projetos' }
      : null,
    isAuthenticated && hasPermission('mediador')
      ? { href: '/mediador/atribuicoes', label: 'Atribuir Grupos' }
      : null,
    isAuthenticated && hasPermission('estudante') && !hasPermission('mediador')
      ? { href: '/estudante/atribuicoes', label: 'Minhas Atribuições' }
      : null,
    isAuthenticated && hasPermission('admin')
      ? { href: '/admin/usuarios', label: 'Administração' }
      : null,
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    window.location.href = '/';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header ref={headerRef} className="relative bg-[var(--cps-red-base)] text-white shadow-[var(--cps-shadow-1)]">
      <div className="flex items-center justify-between gap-2 px-4 py-3 md:gap-3 md:px-6">
        <div className="flex min-w-0 items-center gap-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[var(--cps-red-base)] sm:h-10 sm:w-10 sm:text-sm">
              CPS
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[10px] font-medium uppercase tracking-wide text-white/80 sm:text-xs">
                Centro Paula Souza
              </span>
              <span className="block truncate font-[var(--font-heading)] text-lg font-bold text-white sm:text-2xl">
                Fatec Conecta
              </span>
            </span>
          </Link>

          {navigationLinks.length > 0 && (
            <nav className="hidden items-center gap-6 md:flex">
              {navigationLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-white/90 transition-colors hover:text-[var(--cps-blue-highlight)]">
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {navigationLinks.length > 0 && (
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
              className="rounded-full p-2 transition-colors hover:bg-[var(--cps-red-dark-10)] focus:outline-none focus:ring-2 focus:ring-[var(--cps-blue-highlight)] md:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isMobileMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          )}

          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 rounded-[30px] px-3 py-2 transition-colors hover:bg-[var(--cps-red-dark-10)] focus:outline-none focus:ring-2 focus:ring-[var(--cps-blue-highlight)]"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                {user.user_metadata.avatar && !avatarError ? (
                  <Image
                    src={user.user_metadata.avatar}
                    alt={`Avatar de ${user.user_metadata.name ?? 'Usuário'}`}
                    width={32}
                    height={32}
                    className="rounded-full border border-[var(--cps-gray-light)]"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/70">
                    <User size={16} className="text-white" />
                  </div>
                )}
                <span className="hidden md:block font-medium">{user.user_metadata.name}</span>
                <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-[24px] border border-[var(--cps-gray-light)] bg-white text-[var(--cps-gray-text)] shadow-[var(--cps-shadow-1)]">
                  <div className="px-4 py-3 border-b border-[var(--cps-gray-light)]">
                    <p className="font-medium break-normal text-[var(--cps-blue-base)]">{user.user_metadata.name}</p>
                    <p className="text-sm text-[var(--cps-gray-text)] break-all">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link href="/perfil" onClick={() => setIsDropdownOpen(false)} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[var(--cps-gray-hover)] transition-colors">
                      <User size={16} />
                      <span>Meu Perfil</span>
                    </Link>
                    <Link href="/configuracoes" onClick={() => setIsDropdownOpen(false)} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[var(--cps-gray-hover)] transition-colors">
                      <Settings size={16} />
                      <span>Configurações</span>
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-[var(--cps-red-base)] hover:bg-[var(--cps-feedback-cancelled-light)] transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/autenticacao">
              <Button label="Login" onClick={() => { }} variant="secondary" size="small" className="sm:px-5 sm:py-2.5 sm:text-base" />
            </Link>
          )}
        </div>
      </div>

      {isMobileMenuOpen && navigationLinks.length > 0 && (
        <nav id="mobile-navigation" className="border-t border-white/20 bg-[var(--cps-red-base)] px-4 py-3 shadow-[var(--cps-shadow-1)] md:hidden">
          <div className="flex flex-col gap-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-[30px] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--cps-red-dark-10)] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
