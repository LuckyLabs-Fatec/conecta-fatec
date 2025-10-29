'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@base-ui-components/react/form"
import { LoginAside, Input } from "@/components"
import Link from "next/link";
import { useAuth, UserRole } from "@/hooks/useAuth";
import { loginSchema, LoginSchema } from '@/domain/auth/schemas/login.schema';

export default function LoginPage () {
    const router = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            userType: 'comunidade',
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: LoginSchema) => {
        setIsLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const userData = {
                id: '1',
                name: data.email.split('@')[0].charAt(0).toUpperCase() + data.email.split('@')[0].slice(1),
                email: data.email,
                avatar: `https://doodleipsum.com/700/avatar?i=fd7c77f6b306c724bb34cc62124ff04e`,
                loginTime: new Date().toISOString(),
                role: data.userType as UserRole,
                ...(data.userType === 'coordenacao' && { department: 'Desenvolvimento de Software Multiplataforma' }),
                ...(data.userType === 'mediador' && { specialization: 'Tecnologia e Inovação' })
            };

            login(userData);

            const redirectPath = data.userType === 'mediador' || data.userType === 'coordenacao' 
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
                                <Link href="/cadastro/usuario" className="text-[#CB2616] hover:text-red-700 font-medium underline">
                                    se cadastrar aqui!
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
                            <div>
                                <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Usuário
                                </label>
                                <select
                                    id="userType"
                                    {...register('userType')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                                >
                                    <option value="comunidade">Membro da Comunidade</option>
                                    <option value="mediador">Mediador</option>
                                    <option value="coordenacao">Coordenação</option>
                                </select>
                                {errors.userType && <p className="text-sm text-red-600 mt-1">{errors.userType.message}</p>}
                            </div>

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
                                <a href="/esqueci-senha" className="text-sm text-[#CB2616] hover:text-red-700 underline">
                                    Esqueceu a senha?
                                </a>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-[#CB2616] hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#CB2616] focus:ring-offset-2"
                            >
                                {isLoading ? 'Entrando...' : 'ENTRAR'}
                            </button>
                        </Form>

                        <footer className="mt-8 pt-6 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-4">Novo no Fatec Conecta?</p>
                                <a 
                                    href="/cadastro"
                                    className="inline-block px-6 py-2 border border-[#CB2616] text-[#CB2616] rounded-lg hover:bg-red-50 transition-colors font-medium"
                                >
                                    Criar Conta
                                </a>
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
    )
}