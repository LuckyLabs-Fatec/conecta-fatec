'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form } from "@base-ui-components/react/form"
import { LoginAside } from "@/components/LoginAside"
import { Input } from "@/components/Input"
import Link from "next/link";

export default function LoginPage () {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        
        // Clear errors when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simple validation
        const newErrors: {[key: string]: string} = {};
        if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
        if (!formData.password.trim()) newErrors.password = 'Senha é obrigatória';
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        // Simulate login - accept any email/password combination
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Create user data
            const userData = {
                id: '1',
                name: formData.email.split('@')[0].charAt(0).toUpperCase() + formData.email.split('@')[0].slice(1),
                email: formData.email,
                avatar: `https://doodleipsum.com/700/avatar?i=fd7c77f6b306c724bb34cc62124ff04e`,
                loginTime: new Date().toISOString()
            };
            
            // Store in localStorage
            localStorage.setItem('fatec-conecta-user', JSON.stringify(userData));
            
            // Redirect to home page
            router.push('/');
        } catch {
            setErrors({ general: 'Erro ao fazer login. Tente novamente.' });
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
                            <p className="text-gray-600">
                                Se você ainda não possui uma conta! Pode{' '}
                                <Link href="/cadastro/usuario" className="text-[#CB2616] hover:text-red-700 font-medium underline">
                                    se cadastrar aqui!
                                </Link>
                            </p>
                        </header>

                        {errors.general && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{errors.general}</p>
                            </div>
                        )}

                        <Form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <Input
                                label="Email"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Digite seu email"
                                required={true}
                                value={formData.email}
                                onChange={handleInputChange('email')}
                                error={errors.email}
                            />

                            <Input
                                label="Senha"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Digite sua senha"
                                required={true}
                                value={formData.password}
                                onChange={handleInputChange('password')}
                                error={errors.password}
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