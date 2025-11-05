'use client';
import Image from "next/image";
import { Button } from "../atoms/Button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ChevronDown, User, LogOut, Settings, School } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    // Redirect to home page
    window.location.href = '/';
  };

  // Close dropdown when clicking outside
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
    <header className="bg-[#CB2616] text-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-montserrat), sans-serif', color: '#FCFCFC' }}>Fatec Conecta</h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated && user?.role === 'comunidade' && (
            <Link href="/sugerir-melhoria" className="hover:text-red-200 transition-colors">
              Sugerir Melhoria
            </Link>
          )}
          {isAuthenticated && user?.role === 'estudante' && (
            <Link href="/banco-de-ideias" className="hover:text-red-200 transition-colors">
              Banco de Ideias
            </Link>
          )}
          {isAuthenticated && (user?.role === 'mediador' || user?.role === 'coordenacao') && (
            <Link href="/validar-ideias" className="hover:text-red-200 transition-colors">
              Validar Ideias
            </Link>
          )}
          {isAuthenticated && user?.role === 'coordenacao' && (
            <Link href="/coordenacao/projetos" className="hover:text-red-200 transition-colors">
              Direcionar para Curso
            </Link>
          )}
          <Link href="/acompanhar-projetos" className="hover:text-red-200 transition-colors">
            Acompanhar Projetos
          </Link>
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
              src={user.avatar}
              alt={`Avatar de ${user.name}`}
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="hidden md:block font-medium">{user.name}</span>
            <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg border z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
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
                {user.role === 'coordenacao' && (
                  <Link href="/coordenacao/projetos" className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors">
                    <School size={16} />
                    <span>Direcionar para Curso</span>
                  </Link>
                )}
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
          <Button label="Login" onClick={() => {}} variant="secondary" size="medium" />
        </Link>
      )}
    </header>
  );
};
