'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema, type ReviewSchema } from '@/domain/ideas/schemas/review.schema';
import { Header } from '@/presentation/components';
import { Button } from '@/presentation/components';

const API_IDEAS = '/api/ideias-simples';

const requestLocalApi = async <T,>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error || payload?.message || `Request failed with status code ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
};

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
    const load = async () => {
      try {
        const list = await requestLocalApi<Idea[]>(API_IDEAS);
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
  }, [ideaId]);

  const actionToStatus = (action: ReviewSchema['action']) => {
    switch (action) {
      case 'approve':
        return 'aprovada';
      case 'reject':
        return 'rejeitada';
      case 'request_info':
        return 'aguardando_info';
      default:
        return 'em_analise';
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setResult(null);
    try {
      const json = await requestLocalApi<{ id: string; status: Idea['status']; message: string | null }>(API_IDEAS, {
        method: 'PUT',
        body: JSON.stringify({
          id: ideaId,
          status: actionToStatus(values.action),
          mediatorNotes: values.message ?? '',
        }),
      });
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
        <p className="text-[var(--cps-gray-text)]">Carregando...</p>
      </main>
    );
  }

  if (error || !idea) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--cps-feedback-cancelled)]">{error ?? 'Ideia não encontrada'}</p>
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--cps-silver-base)] py-8">
        <section className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Analisar Ideia</h1>

          <article className="bg-white border rounded p-4 mb-6">
            <h2 className="text-xl font-semibold">{idea.titulo}</h2>
            <p className="text-[var(--cps-gray-text)] mt-2">{idea.descricao}</p>
            <p className="text-sm text-[var(--cps-gray-text)] mt-2">Autor: {idea.autor}</p>
            <p className="text-sm text-[var(--cps-gray-text)]">Status atual: {idea.status}</p>
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
                <label htmlFor="review-message" className="block text-sm font-medium text-[var(--cps-gray-text)] mb-1">Mensagem ao usuário</label>
                <textarea
                  id="review-message"
                  {...form.register('message')}
                  rows={4}
                  className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-[var(--cps-blue-highlight)] focus:border-[var(--cps-blue-base)]"
                  placeholder="Escreva um feedback curto ou solicite informações necessárias"
                />
                {form.formState.errors.message && (
                  <p className="text-xs text-[var(--cps-feedback-cancelled)] mt-1">{form.formState.errors.message.message}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button label="Enviar" onClick={() => { }} variant="primary" size="medium" />
                <button type="submit" className="hidden" />
                <Button label="Voltar" onClick={() => router.push('/validar-ideias')} variant="secondary" size="medium" />
              </div>
            </form>

            {result && (
              <div className="mt-4 text-sm text-[var(--cps-gray-text)]">{result}</div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
