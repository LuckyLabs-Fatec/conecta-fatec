'use client';
import { useState } from 'react';
import { Form } from "@base-ui-components/react/form"
import { LoginAside } from "@/components/LoginAside"
import { Input } from "@/components/Input"
import Link from "next/link";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });

    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newErrors: {[key: string]: string} = {};
        
        // Validation
        if (!formData.name.trim()) {
            newErrors.name = 'Nome completo é obrigatório';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        
        if (!formData.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Senhas não coincidem';
        }
        
        if (!formData.agreeToTerms) {
            newErrors.terms = 'Você deve aceitar os termos e condições';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        // Submit form
        console.log('Registering user:', formData);
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
                            <p className="text-gray-600">
                                Já possui uma conta?{' '}
                                <Link 
                                    href="/autenticacao" 
                                    className="text-[#CB2616] hover:text-red-700 font-medium underline"
                                >
                                    Faça login aqui!
                                </Link>
                            </p>
                        </header>

                        <Form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <Input
                                label="Nome completo"
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Digite seu nome completo"
                                required={true}
                                value={formData.name}
                                onChange={handleInputChange('name')}
                                error={errors.name}
                            />

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
                                description="Utilizaremos seu email para enviar atualizações sobre seus relatos"
                            />

                            <Input
                                label="Telefone"
                                id="phone"
                                type="tel"
                                name="phone"
                                placeholder="(11) 99999-9999"
                                value={formData.phone}
                                onChange={handleInputChange('phone')}
                                description="Opcional - Para contato em caso de necessidade"
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
                                description="Mínimo 8 caracteres"
                            />

                            <Input
                                label="Confirmar senha"
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                placeholder="Digite novamente sua senha"
                                required={true}
                                value={formData.confirmPassword}
                                onChange={handleInputChange('confirmPassword')}
                                error={errors.confirmPassword}
                            />

                            <div className="space-y-4">
                                <label className="flex items-start gap-3">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.agreeToTerms}
                                        onChange={(e) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                agreeToTerms: e.target.checked
                                            }));
                                            if (errors.terms) {
                                                setErrors(prev => ({
                                                    ...prev,
                                                    terms: ''
                                                }));
                                            }
                                        }}
                                        className="h-4 w-4 text-[#CB2616] focus:ring-[#CB2616] border-gray-300 rounded mt-0.5"
                                        required
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
                                {errors.terms && (
                                    <p className="text-sm text-red-600" role="alert">
                                        {errors.terms}
                                    </p>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-[#CB2616] hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#CB2616] focus:ring-offset-2"
                            >
                                CRIAR CONTA
                            </button>
                        </Form>

                        <footer className="mt-8 pt-6 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-4">
                                    Ao criar uma conta, você se torna parte da solução
                                </p>
                                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                    <span>Ambiente seguro</span>
                                    <span>•</span>
                                    <span>Dados protegidos</span>
                                    <span>•</span>
                                    <span>LGPD compliant</span>
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