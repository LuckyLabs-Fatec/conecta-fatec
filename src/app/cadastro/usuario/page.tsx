'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@base-ui-components/react/form"
import { LoginAside, Input, Button, MaskedInput, type MaskConfig } from "@/presentation/components"
import { useAuth } from "@/presentation/hooks/useAuth"
import Link from "next/link";
import { registerSchema, RegisterSchema } from '@/domain/auth/schemas/register.schema';
import { useToast } from "@/presentation/components";
import { LegalDocumentModal, type LegalDocumentType } from "@/presentation/components/legal/LegalDocumentModal";

const phoneMaskConfig: MaskConfig = {
    pattern: (value: string) => {
        return value.length <= 10 ? '(xx) xxxx-xxxx' : '(xx) xxxxx-xxxx';
    },
    charRegex: /^\d{0,11}$/,
    placeholder: '(11) 99999-9999'
};

export default function RegisterPage() {
    const router = useRouter();
    const { signup } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [legalDocument, setLegalDocument] = useState<LegalDocumentType | null>(null);
    const { show } = useToast();

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: false
        }
    });

    const onSubmit = async (data: RegisterSchema) => {
        setIsLoading(true);
        setAuthError(null);
        try {
            await signup(data);
            show({
                kind: 'success',
                message: 'Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.',
            });
            router.push('/autenticacao');
        } catch (error: unknown) {
            const err = error as Error;
            setAuthError(err.message);
            console.error('Erro ao criar conta:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen">
            <LoginAside
                title="Junte-se ao Fatec Conecta"
                description="Faça parte de uma comunidade que transforma problemas em soluções. Registre-se e comece a fazer a diferença hoje mesmo."
            />

            <section className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[var(--cps-silver-base)]">
                <div className="w-full max-w-md">
                    <div className="cps-card p-8">
                        <header className="mb-8">
                            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-[var(--cps-red-base)]">Cadastro institucional</p>
                            <h2 className="text-2xl font-bold text-[var(--cps-blue-base)] mb-2">Criar Conta</h2>
                            <p className="text-[var(--cps-gray-text)] mb-4">
                                Já possui uma conta?{' '}
                                <Link
                                    href="/autenticacao"
                                    className="text-[var(--cps-blue-base)] hover:text-[var(--cps-blue-title-hover)] font-medium underline"
                                >
                                    Faça login aqui!
                                </Link>
                            </p>
                        </header>

                        <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                            {authError && (
                                <div className="bg-[var(--cps-feedback-cancelled-light)] border border-[var(--cps-feedback-cancelled-light)] text-[var(--cps-feedback-cancelled)] rounded-[30px] p-3">
                                    {authError}
                                </div>
                            )}
                            <Input
                                label="Nome completo"
                                id="name"
                                type="text"
                                placeholder="Digite seu nome completo"
                                required={true}
                                {...register('name')}
                                error={errors.name?.message}
                            />

                            <Input
                                label="Email"
                                id="email"
                                type="email"
                                placeholder="Digite seu email"
                                required={true}
                                {...register('email')}
                                error={errors.email?.message}
                            />

                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <MaskedInput
                                        label="Telefone"
                                        id="phone"
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                        error={errors.phone?.message}
                                        maskConfig={phoneMaskConfig}
                                    />
                                )}
                            />


                            <Input
                                label="Senha"
                                id="password"
                                type="password"
                                placeholder="Digite sua senha"
                                required={true}
                                {...register('password')}
                                error={errors.password?.message}
                                description="Mínimo 8 caracteres"
                            />

                            <Input
                                label="Confirmar senha"
                                id="confirmPassword"
                                type="password"
                                placeholder="Digite novamente sua senha"
                                required={true}
                                {...register('confirmPassword')}
                                error={errors.confirmPassword?.message}
                            />

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <input
                                        id="agreeToTerms"
                                        type="checkbox"
                                        {...register('agreeToTerms')}
                                        className="h-4 w-4 text-[var(--cps-blue-base)] focus:ring-[var(--cps-blue-highlight)] border-[var(--cps-gray-light)] rounded mt-0.5"
                                    />
                                    <span className="text-sm text-[var(--cps-gray-text)] leading-relaxed">
                                        <label htmlFor="agreeToTerms">
                                            Eu aceito os
                                        </label>
                                        {' '}
                                        <button
                                            type="button"
                                            onClick={() => setLegalDocument('terms')}
                                            className="text-[var(--cps-blue-base)] hover:text-[var(--cps-blue-text-hover)] underline"
                                        >
                                            termos e condições
                                        </button>
                                        {' '}e a{' '}
                                        <button
                                            type="button"
                                            onClick={() => setLegalDocument('privacy')}
                                            className="text-[var(--cps-blue-base)] hover:text-[var(--cps-blue-text-hover)] underline"
                                        >
                                            política de privacidade
                                        </button>
                                    </span>
                                </div>
                                {errors.agreeToTerms && (
                                    <p className="text-sm text-[var(--cps-feedback-cancelled)]" role="alert">
                                        {errors.agreeToTerms.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Button
                                    label={isLoading ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
                                    disabled={isLoading}
                                    variant="primary"
                                    size="large"
                                    type="submit"
                                    className="w-full"
                                />
                            </div>
                        </Form>

                        <footer className="mt-8 pt-6 border-t border-[var(--cps-gray-light)]">
                            <div className="text-center">
                                <p className="text-sm text-[var(--cps-gray-text)] mb-4">
                                    Ao criar uma conta, você se torna parte da solução para melhorar nossa comunidade
                                </p>
                                <div className="flex items-center justify-center gap-2 text-xs text-[var(--cps-gray-text)]">
                                    <span>Ambiente seguro</span>
                                    <span>•</span>
                                    <span>Dados protegidos</span>
                                    <span>•</span>
                                    <span>LGPD compliant</span>
                                </div>
                                <div className="mt-4">
                                    <Link
                                        href="/"
                                        className="inline-block px-6 py-2 text-sm font-medium text-[var(--cps-gray-text)] hover:text-[var(--cps-blue-base)] underline"
                                    >
                                        Voltar para a página inicial
                                    </Link>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </section>

            {legalDocument && (
                <LegalDocumentModal
                    type={legalDocument}
                    onClose={() => setLegalDocument(null)}
                />
            )}
        </main>
    );
}
