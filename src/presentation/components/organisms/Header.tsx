'use client';
import Image from "next/image";
import { Button } from "../atoms/Button";
import Link from "next/link";
import { useAuth } from "@/presentation/hooks/useAuth";
import { ChevronDown, User, LogOut, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const Header = () => {
  const { user, logout, isAuthenticated, hasPermission } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mockAvatar = 'https://doodleipsum.com/700/avatar-2'

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    window.location.href = '/';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[var(--cps-red-base)] text-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-montserrat), sans-serif', color: '#FCFCFC' }}>Fatec Conecta</h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated && hasPermission('comunidade') && (
            <Link href="/submeter-proposta" className="hover:text-red-200 transition-colors">
              Submeter Proposta
            </Link>
          )}
          {/* Unified Dashboard Link */}
          {isAuthenticated && hasPermission('mediador') && (
            <Link href="/acompanhar-projetos" className="hover:text-red-200 transition-colors">
              Acompanhar Projetos
            </Link>
          )}
          {isAuthenticated && hasPermission('admin') && (
            <Link href="/admin/usuarios" className="hover:text-red-200 transition-colors">
              Administração
            </Link>
          )}
        </nav>
      </div>

      {isAuthenticated && user ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 hover:bg-red-700 px-3 py-2 rounded-lg transition-colors"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <Image
              src={user.user_metadata.avatar ? user.user_metadata.avatar : mockAvatar}
              alt={`Avatar de ${user.user_metadata.name ?? 'Usuário'}`}
              width={32}
              height={32}
              className="rounded-full border border-gray-200"
            />
            <span className="hidden md:block font-medium">{user.user_metadata.name}</span>
            <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg border z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="font-medium break-normal">{user.user_metadata.name}</p>
                <p className="text-sm text-gray-500 break-all">{user.email}</p>
              </div>

              <div className="py-1">
                <Link href="/perfil" onClick={() => setIsDropdownOpen(false)} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors">
                  <User size={16} />
                  <span>Meu Perfil</span>
                </Link>
                <Link href="/configuracoes" onClick={() => setIsDropdownOpen(false)} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors">
                  <Settings size={16} />
                  <span>Configurações</span>
                </Link>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
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
          <Button label="Login" onClick={() => { }} variant="secondary" size="medium" />
        </Link>
      )}
    </header>
  );
};
