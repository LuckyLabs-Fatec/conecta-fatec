'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, useToast } from '@/presentation/components';
import { useAuth } from '@/presentation/hooks/useAuth';
import { Trash2, Search } from 'lucide-react';

interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  perfil: 'comunidade' | 'estudante' | 'mediador' | 'coordenador' | 'admin';
}

// Dados mockados
const mockUsers: User[] = [
  { id: '1', nome: 'João Silva', email: 'joao.silva@fatec.sp.gov.br', telefone: '11987654321', perfil: 'estudante' },
  { id: '2', nome: 'Maria Santos', email: 'maria.santos@fatec.sp.gov.br', telefone: '11976543210', perfil: 'mediador' },
  { id: '3', nome: 'Pedro Oliveira', email: 'pedro.oliveira@fatec.sp.gov.br', telefone: '11965432109', perfil: 'coordenador' },
  { id: '4', nome: 'Ana Costa', email: 'ana.costa@gmail.com', telefone: '11954321098', perfil: 'comunidade' },
  { id: '5', nome: 'Carlos Souza', email: 'carlos.souza@fatec.sp.gov.br', telefone: '11943210987', perfil: 'estudante' },
  { id: '6', nome: 'Juliana Lima', email: 'juliana.lima@hotmail.com', telefone: '11932109876', perfil: 'comunidade' },
  { id: '7', nome: 'Roberto Alves', email: 'roberto.alves@fatec.sp.gov.br', telefone: '11921098765', perfil: 'mediador' },
  { id: '8', nome: 'Fernanda Rocha', email: 'fernanda.rocha@yahoo.com', telefone: '11910987654', perfil: 'comunidade' },
  { id: '9', nome: 'Lucas Martins', email: 'lucas.martins@fatec.sp.gov.br', telefone: '11909876543', perfil: 'coordenador' },
  { id: '10', nome: 'Patricia Ferreira', email: 'patricia.ferreira@gmail.com', telefone: '11898765432', perfil: 'comunidade' },
  { id: '11', nome: 'Ricardo Gomes', email: 'ricardo.gomes@fatec.sp.gov.br', telefone: '11887654321', perfil: 'estudante' },
  { id: '12', nome: 'Camila Dias', email: 'camila.dias@outlook.com', telefone: '11876543210', perfil: 'comunidade' },
];

const roleLabels: Record<string, string> = {
  comunidade: 'Comunidade',
  estudante: 'Estudante',
  mediador: 'Mediador',
  coordenador: 'Coordenador',
  admin: 'admin',
};

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, hasPermission } = useAuth();
  const { show } = useToast();

  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchField, setSearchField] = useState<'nome' | 'email' | 'telefone' | 'perfil'>('nome');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasPermission('admin')) {
      show({
        kind: 'error',
        message: 'Acesso negado. Apenas administradores podem acessar esta página.',
      });
      router.push('/');
    }
  }, [isLoading, isAuthenticated, user, router, show, hasPermission]);

  if (isLoading || !isAuthenticated || !hasPermission('admin')) {
    return null;
  }

  const isFatecEmail = (email: string): boolean => {
    return email.endsWith('@fatec.sp.gov.br');
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;

    if (newRole !== 'comunidade' && !isFatecEmail(userToUpdate.email)) {
      show({
        kind: 'error',
        message: 'Apenas usuários com email @fatec.sp.gov.br podem ter perfis de estudante, mediador ou coordenador.',
      });
      return;
    }

    setUsers(users.map(u =>
      u.id === userId ? { ...u, perfil: newRole as User['perfil'] } : u
    ));

    show({
      kind: 'success',
      message: `Perfil de ${userToUpdate.nome} alterado para ${roleLabels[newRole]}.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;

    if (window.confirm(`Tem certeza que deseja excluir o usuário ${userToDelete.nome}?`)) {
      setUsers(users.filter(u => u.id !== userId));
      show({
        kind: 'success',
        message: `Usuário ${userToDelete.nome} excluído com sucesso.`,
      });
    }
  };

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const value = user[searchField].toLowerCase();
    return value.includes(searchQuery.toLowerCase());
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Administração de Usuários
            </h1>
            <p className="text-gray-600">
              Gerencie os usuários cadastrados no sistema
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search-field" className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar por
                </label>
                <select
                  id="search-field"
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value as typeof searchField)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                >
                  <option value="nome">Nome</option>
                  <option value="email">Email</option>
                  <option value="telefone">Telefone</option>
                  <option value="perfil">Perfil</option>
                </select>
              </div>
              <div className="flex-[2]">
                <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Pesquisar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder={`Buscar por ${searchField}...`}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Perfil
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        Nenhum usuário encontrado
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.nome}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{user.telefone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.perfil}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                          >
                            <option value="comunidade">Comunidade</option>
                            <option
                              value="estudante"
                              disabled={!isFatecEmail(user.email)}
                            >
                              Estudante
                            </option>
                            <option
                              value="mediador"
                              disabled={!isFatecEmail(user.email)}
                            >
                              Mediador
                            </option>
                            <option
                              value="coordenador"
                              disabled={!isFatecEmail(user.email)}
                            >
                              Coordenador
                            </option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Excluir usuário"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Mostrando {indexOfFirstUser + 1} a {Math.min(indexOfLastUser, filteredUsers.length)} de {filteredUsers.length} usuários
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                          ? 'bg-[#CB2616] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
