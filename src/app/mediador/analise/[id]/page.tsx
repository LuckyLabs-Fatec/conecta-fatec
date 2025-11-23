'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema, type ReviewSchema } from '@/domain/ideas/schemas/review.schema';
import { Header } from '@/presentation/components';
import { Button } from '@/presentation/components';

interface Idea {
  id: string;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada' | 'aguardando_info';
  autor: string;
  createdAt: string;
}

export default function MediatorReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const ideaId = String(params?.id ?? '');

  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<ReviewSchema>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { action: 'approve', message: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!isLoading) {
      if (!user || (user.role as string)?.toLowerCase() !== 'mediador') {
        router.push('/');
      }
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await fetch('/api/ideias-simples', { signal: controller.signal, cache: 'no-store' });
        if (!res.ok) throw new Error('Falha ao carregar ideia');
        const list: Idea[] = await res.json();
        const found = list.find((i) => i.id === ideaId) || null;
        if (!found) throw new Error('Ideia não encontrada');
        setIdea(found);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Erro ao carregar';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    if (ideaId) load();
    return () => controller.abort();
  }, [ideaId]);

  const onSubmit = form.handleSubmit(async (values) => {
    setResult(null);
    try {
      const res = await fetch(`/api/ideias-simples/${ideaId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Falha ao enviar revisão');
      const json: { id: string; status: Idea['status']; message: string | null } = await res.json();
      setResult(`Status atualizado para: ${json.status}${json.message ? ' | Feedback: ' + json.message : ''}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro ao enviar';
      setResult(`Erro: ${msg}`);
    }
  });

  const setAction = (a: ReviewSchema['action']) => {
    form.setValue('action', a, { shouldValidate: true, shouldDirty: true });
  };

  if (isLoading || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </main>
    );
  }

  if (error || !idea) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error ?? 'Ideia não encontrada'}</p>
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <section className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Analisar Ideia</h1>

          <article className="bg-white border rounded p-4 mb-6">
            <h2 className="text-xl font-semibold">{idea.titulo}</h2>
            <p className="text-gray-700 mt-2">{idea.descricao}</p>
            <p className="text-sm text-gray-500 mt-2">Autor: {idea.autor}</p>
            <p className="text-sm text-gray-500">Status atual: {idea.status}</p>
          </article>

          <div className="bg-white border rounded p-4">
            <h3 className="font-semibold mb-3">Ação</h3>
            <div className="flex gap-2 mb-4">
              <Button label="Aprovar" onClick={() => setAction('approve')} variant="primary" size="small" />
              <Button label="Rejeitar" onClick={() => setAction('reject')} variant="secondary" size="small" />
              <Button label="Solicitar Info" onClick={() => setAction('request_info')} variant="secondary" size="small" />
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label htmlFor="review-message" className="block text-sm font-medium text-gray-700 mb-1">Mensagem ao usuário</label>
                <textarea
                  id="review-message"
                  {...form.register('message')}
                  rows={4}
                  className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616]"
                  placeholder="Escreva um feedback curto ou solicite informações necessárias"
                />
                {form.formState.errors.message && (
                  <p className="text-xs text-red-600 mt-1">{form.formState.errors.message.message}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button label="Enviar" onClick={() => { }} variant="primary" size="medium" />
                <button type="submit" className="hidden" />
                <Button label="Voltar" onClick={() => router.push('/validar-ideias')} variant="secondary" size="medium" />
              </div>
            </form>

            {result && (
              <div className="mt-4 text-sm text-gray-700">{result}</div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
