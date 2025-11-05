'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@base-ui-components/react/form"
import { LoginAside, Input, Button } from "@/presentation/components"
import Link from "next/link";
import { useAuth, UserRole } from "@/presentation/hooks/useAuth";
import { loginSchema, LoginSchema } from '@/domain/auth/schemas/login.schema';
import { resolveMockUser } from '@/domain/auth/mockUsers';

export default function LoginPage () {
    const router = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const { register, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: LoginSchema) => {
        setIsLoading(true);
        try {
            // Simulate API delay
            setAuthError(null);
            await new Promise(resolve => setTimeout(resolve, 800));

            const mock = resolveMockUser(data.email, data.password);
            if (!mock) {
                setAuthError('Email ou senha inválidos. Consulte as credenciais em MOCK_LOGINS.md.');
                setError('email', { type: 'manual', message: ' ' });
                setError('password', { type: 'manual', message: 'Email ou senha inválidos' });
                return;
            }

            const role: UserRole = mock.role;
            const name = mock.name;

            const userData = {
                id: '1',
                name,
                email: data.email,
                avatar: `https://doodleipsum.com/700/avatar?i=fd7c77f6b306c724bb34cc62124ff04e`,
                loginTime: new Date().toISOString(),
                role,
                ...(mock.department && { department: mock.department }),
                ...(mock.specialization && { specialization: mock.specialization })
            };

            login(userData);

            const redirectPath = role === 'mediador' || role === 'coordenacao' 
                ? '/validar-ideias' 
                : '/';
            router.push(redirectPath);
        } catch (err) {
            // Could map to toast or form error
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen">
            <LoginAside />
            <section className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <header className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Login</h2>
                            <p className="text-gray-600 mb-4">
                                Se você ainda não possui uma conta! Pode{' '}
                                <Link href="/cadastro/usuario" className="text-[var(--cps-blue-base)] hover:text-[var(--cps-blue-text-hover)] font-medium underline">
                                    se cadastrar aqui!
                                </Link>
                            </p>
                        </header>

                        <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                            {authError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
                                    {authError}
                                </div>
                            )}

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
                                label="Senha"
                                id="password"
                                type="password"
                                placeholder="Digite sua senha"
                                required={true}
                                {...register('password')}
                                error={errors.password?.message}
                            />

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        className="h-4 w-4 text-[#CB2616] focus:ring-[#CB2616] border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Lembre-se de mim</span>
                                </label>
                                <a href="/esqueci-senha" className="text-sm text-[var(--cps-blue-base)] hover:text-[var(--cps-blue-text-hover)] underline">
                                    Esqueceu a senha?
                                </a>
                            </div>

                            <Button
                                label={isLoading ? 'Entrando...' : 'ENTRAR'}
                                disabled={isLoading}
                                variant="primary"
                                size="large"
                                type="submit"
                                className="w-full rounded-md"
                            />
                        </Form>

                        <footer className="mt-8 pt-6 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-4">Novo no Fatec Conecta?</p>
                                <Link
                                    href="/cadastro/usuario"
                                    className='inline-block px-6 py-2 border border-[var(--cps-blue-base)] text-[var(--cps-blue-base)] rounded-lg hover:bg-[var(--cps-blue-text-hover)] transition-colors font-medium'
                                >
                                    Criar Conta
                                </Link>
                            </div>
                        </footer>
                    </div>
                </div>
            </section>
        </main>
    )
}