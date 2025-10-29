'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Header } from '@/components';
import { Button } from '@/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assignmentSchema, type AssignmentSchema } from '@/domain/projects/schemas/assignment.schema';

interface CoordProjeto {
  id: string;
  titulo: string;
  descricao: string;
  status: 'aprovada' | 'validada' | 'direcionada' | 'backlog';
  curso?: string;
  turma?: string;
  semestre?: string;
  professor?: string;
}

export default function CoordenacaoProjetosPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<CoordProjeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<CoordProjeto | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const assignForm = useForm<AssignmentSchema>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: { curso: '', turma: '', semestre: '', professor: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== 'coordenacao') router.push('/');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await fetch('/api/coordenacao/projetos', { signal: controller.signal, cache: 'no-store' });
        if (!res.ok) throw new Error('Falha ao carregar');
        const data: CoordProjeto[] = await res.json();
        setItems(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Erro ao buscar dados';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const act = async (id: string, action: 'validar' | 'backlog') => {
    setResult(null);
    const res = await fetch(`/api/coordenacao/projetos/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    if (!res.ok) throw new Error('Falha na ação');
    const json = await res.json();
    setResult(`Projeto ${id}: ${json.status}`);
  };

  const submitAssign = assignForm.handleSubmit(async (values) => {
    if (!selected) return;
    setResult(null);
    const res = await fetch(`/api/coordenacao/projetos/${selected.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'direcionar', ...values }),
    });
    if (!res.ok) {
      setResult('Falha ao direcionar');
      return;
    }
    const json = await res.json();
    setResult(`Projeto ${selected.id}: ${json.status} para ${json.curso}`);
    assignForm.reset();
    setSelected(null);
  });

  if (isLoading || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <section className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Coordenação — Projetos</h1>
          {result && <div className="mb-4 text-sm text-gray-700">{result}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((p) => (
              <article key={p.id} className="bg-white border rounded p-4 flex flex-col gap-2">
                <header className="flex items-center justify-between">
                  <h2 className="font-semibold">{p.titulo}</h2>
                  <span className="text-xs px-2 py-1 rounded bg-neutral-100 border">{p.status}</span>
                </header>
                <p className="text-sm text-neutral-700">{p.descricao}</p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <Button label="Validar Ideia" onClick={() => act(p.id, 'validar')} variant="primary" size="small" />
                  <Button label="Direcionar p/ Curso" onClick={() => setSelected(p)} variant="secondary" size="small" />
                  <Button label="Enviar ao Backlog" onClick={() => act(p.id, 'backlog')} variant="secondary" size="small" />
                </div>
              </article>
            ))}
          </div>

          {selected && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-lg w-full p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold">Direcionar para Curso — {selected.titulo}</h3>
                  <button className="text-xl" onClick={() => setSelected(null)}>×</button>
                </div>
                <form onSubmit={submitAssign} className="space-y-3">
                  <div>
                    <label htmlFor="curso" className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                    <input id="curso" {...assignForm.register('curso')} className="w-full px-3 py-2 border rounded" />
                    {assignForm.formState.errors.curso && <p className="text-xs text-red-600 mt-1">{assignForm.formState.errors.curso.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="turma" className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
                      <input id="turma" {...assignForm.register('turma')} className="w-full px-3 py-2 border rounded" />
                      {assignForm.formState.errors.turma && <p className="text-xs text-red-600 mt-1">{assignForm.formState.errors.turma.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="semestre" className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
                      <input id="semestre" {...assignForm.register('semestre')} className="w-full px-3 py-2 border rounded" />
                      {assignForm.formState.errors.semestre && <p className="text-xs text-red-600 mt-1">{assignForm.formState.errors.semestre.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="professor" className="block text-sm font-medium text-gray-700 mb-1">Professor</label>
                    <input id="professor" {...assignForm.register('professor')} className="w-full px-3 py-2 border rounded" />
                    {assignForm.formState.errors.professor && <p className="text-xs text-red-600 mt-1">{assignForm.formState.errors.professor.message}</p>}
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <Button label="Cancelar" onClick={() => setSelected(null)} variant="secondary" size="medium" />
                    <Button label="Direcionar" onClick={() => {}} variant="primary" size="medium" />
                    <button type="submit" className="hidden" />
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
