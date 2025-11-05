'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@base-ui-components/react/form"
import { LoginAside, Input, Button } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link";
import { registerSchema, RegisterSchema } from '@/domain/auth/schemas/register.schema';

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
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
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1200));

            const userData = {
                id: Date.now().toString(),
                name: data.name,
                email: data.email,
                avatar: `https://doodleipsum.com/700/avatar?i=${Math.random()}`,
                loginTime: new Date().toISOString(),
                role: 'comunidade' as const
            };

            login(userData);

            const redirectPath = '/';
            router.push(redirectPath);
        } catch (error) {
            console.error('Erro ao criar conta:', error);
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

            <section className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <header className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Criar Conta</h2>
                            <p className="text-gray-600 mb-4">
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

                            <Input
                                label="Telefone"
                                id="phone"
                                type="tel"
                                placeholder="(11) 99999-9999"
                                {...register('phone')}
                                error={errors.phone?.message}
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
                                <label className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        {...register('agreeToTerms')}
                                        className="h-4 w-4 text-[var(--cps-blue-base)] focus:ring-[var(--cps-blue-base)] border-gray-300 rounded mt-0.5"
                                    />
                                    <span className="text-sm text-gray-600 leading-relaxed">
                                        Eu aceito os{' '}
                                        <Link
                                            href="/termos"
                                            className="text-[var(--cps-blue-base)] hover:text-[var(--cps-blue-text-hover)] underline"
                                            target="_blank"
                                        >
                                            termos e condições
                                        </Link>
                                        {' '}e a{' '}
                                        <Link
                                            href="/privacidade"
                                            className="text-[var(--cps-blue-base)] hover:text-[var(--cps-blue-text-hover)] underline"
                                            target="_blank"
                                        >
                                            política de privacidade
                                        </Link>
                                    </span>
                                </label>
                                {errors.agreeToTerms && (
                                    <p className="text-sm text-red-600" role="alert">
                                        {errors.agreeToTerms.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Button
                                    label={isLoading ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
                                    onClick={() => {}}
                                    disabled={isLoading}
                                    variant="primary"
                                    size="large"
                                    type="submit"
                                    className="w-full rounded-md"
                                />
                            </div>
                        </Form>

                        <footer className="mt-8 pt-6 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-4">
                                    Ao criar uma conta, você se torna parte da solução para melhorar nossa comunidade
                                </p>
                                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                    <span>🔒 Ambiente seguro</span>
                                    <span>•</span>
                                    <span>📋 Dados protegidos</span>
                                    <span>•</span>
                                    <span>✅ LGPD compliant</span>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </section>
        </main>
    );
}