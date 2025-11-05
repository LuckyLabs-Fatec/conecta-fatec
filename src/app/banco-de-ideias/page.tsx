'use client';
import { useEffect, useMemo, useState } from 'react';
import { Header, useToast } from '@/presentation/components';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Search, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/presentation/components';

type SimpleIdea = {
  id: string;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada' | 'aguardando_info';
  autor: string;
  createdAt: string;
};

const STORAGE_KEY = 'fatec-conecta-backlog-interests';

export default function BancoDeIdeiasPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { show } = useToast();

  const [ideas, setIdeas] = useState<SimpleIdea[]>([]);
  const [search, setSearch] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const userId = user?.id ?? '';

  // Guard: only students can access
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/autenticacao');
      } else if (user.role !== 'estudante') {
        router.push('/');
      }
    }
  }, [user, isLoading, router]);

  // Load ideas
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/ideias-simples', { cache: 'no-store' });
        const data: SimpleIdea[] = await res.json();
        const approved = data.filter((i) => i.status === 'aprovada');
        setIdeas(approved);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  // Load interests from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw || !userId) return;
      const parsed = JSON.parse(raw) as Record<string, string[]>;
      setInterests(parsed[userId] ?? []);
    } catch (e) {
      console.error('Erro ao carregar interesses:', e);
    }
  }, [userId]);

  const filteredIdeas = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ideas;
    return ideas.filter((i) =>
      i.titulo.toLowerCase().includes(q) ||
      i.descricao.toLowerCase().includes(q) ||
      i.autor.toLowerCase().includes(q)
    );
  }, [ideas, search]);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  const markInterest = (ideaId: string) => {
    if (!userId) return;
    setInterests((prev) => {
      if (prev.includes(ideaId)) return prev;
      const next = [...prev, ideaId];
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const map = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
        map[userId] = next;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
        show({ message: 'Interesse registrado! Entraremos em contato com mais detalhes.', kind: 'success' });
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  if (isLoading || !user || user.role !== 'estudante') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#CB2616] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Banco de Ideias</h1>
            <p className="text-gray-600">Escolha uma ideia aprovada para trabalhar neste semestre.</p>
          </div>

          {/* Filtros simples */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div>
              <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
                <Search size={16} className="inline mr-1" /> Pesquisar
              </label>
              <input
                id="search-input"
                type="text"
                placeholder="Buscar por título, descrição ou autor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-600">{filteredIdeas.length} ideia(s) disponível(is)</span>
              <button className="text-sm text-[#CB2616] hover:text-red-700 font-medium" onClick={() => setSearch('')}>Limpar</button>
            </div>
          </div>

          {/* Grid de ideias */}
          {filteredIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeas.map((i) => {
                const interested = interests.includes(i.id);
                return (
                  <div key={i.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{i.titulo}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{i.descricao}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={16} />
                        <span>{i.autor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>{formatDate(i.createdAt)}</span>
                      </div>
                      <div className="inline-flex items-center gap-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle size={14} />
                        <span>Aprovada</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={14}/>Votorantim</span>
                      {interested ? (
                        <span className="text-green-700 text-sm">Interesse registrado</span>
                      ) : (
                        <Button label="Quero participar" onClick={() => markInterest(i.id)} variant="primary" size="small" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users size={64} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhuma ideia disponível</h3>
              <p className="text-gray-500">Tente ajustar a busca ou volte mais tarde.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
