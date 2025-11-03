'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@base-ui-components/react/form"
import { LoginAside, Input } from "@/components"
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
                                    className="text-[#CB2616] hover:text-red-700 font-medium underline"
                                >
                                    Faça login aqui!
                                </Link>
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-800 mb-2">Tipos de Usuário:</h3>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li><strong>Membro da Comunidade:</strong> Pode sugerir ideias de melhoria</li>
                                    <li><strong>Mediador:</strong> Analisa e faz triagem das ideias</li>
                                    <li><strong>Coordenação:</strong> Atribui projetos aprovados às turmas</li>
                                </ul>
                            </div>
                        </header>

                        <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                            {/* Removido: seleção de tipo de usuário no cadastro. Novas contas são "comunidade". */}

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

                            {/* Removidos campos condicionais de coordenação e mediador. */}

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
                                        className="h-4 w-4 text-[#CB2616] focus:ring-[#CB2616] border-gray-300 rounded mt-0.5"
                                    />
                                    <span className="text-sm text-gray-600 leading-relaxed">
                                        Eu aceito os{' '}
                                        <Link
                                            href="/termos"
                                            className="text-[#CB2616] hover:text-red-700 underline"
                                            target="_blank"
                                        >
                                            termos e condições
                                        </Link>
                                        {' '}e a{' '}
                                        <Link
                                            href="/privacidade"
                                            className="text-[#CB2616] hover:text-red-700 underline"
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

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#CB2616] hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#CB2616] focus:ring-offset-2"
                            >
                                {isLoading ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
                            </button>
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

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Uma iniciativa{' '}
                            <span className="font-medium text-[#CB2616]">Lucky Labs</span>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}