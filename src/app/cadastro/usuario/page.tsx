'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form } from "@base-ui-components/react/form"
import { LoginAside } from "@/components/LoginAside"
import { Input } from "@/components/Input"
import { useAuth, UserRole } from "@/hooks/useAuth"
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        userType: 'comunidade' as UserRole,
        department: '',
        specialization: '',
        agreeToTerms: false
    });
    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const newErrors: { [key: string]: string } = {};

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

        // Validate type-specific fields
        if (formData.userType === 'coordenacao' && !formData.department.trim()) {
            newErrors.department = 'Departamento é obrigatório para coordenação';
        }

        if (formData.userType === 'mediador' && !formData.specialization.trim()) {
            newErrors.specialization = 'Especialização é obrigatória para mediadores';
        }

        if (!formData.agreeToTerms) {
            newErrors.terms = 'Você deve aceitar os termos e condições';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Create user data
            const userData = {
                id: Date.now().toString(),
                name: formData.name,
                email: formData.email,
                avatar: `https://doodleipsum.com/700/avatar?i=${Math.random()}`,
                loginTime: new Date().toISOString(),
                role: formData.userType,
                ...(formData.userType === 'coordenacao' && { department: formData.department }),
                ...(formData.userType === 'mediador' && { specialization: formData.specialization })
            };

            // Use login from useAuth hook
            login(userData);

            // Redirect based on user role
            const redirectPath = formData.userType === 'mediador' || formData.userType === 'coordenacao' 
                ? '/validar-ideias' 
                : '/';
            router.push(redirectPath);
        } catch (error) {
            console.error('Erro ao criar conta:', error);
            setErrors({ general: 'Erro ao criar conta. Tente novamente.' });
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

                        {errors.general && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{errors.general}</p>
                            </div>
                        )}

                        <Form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div>
                                <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Usuário *
                                </label>
                                <select
                                    id="userType"
                                    name="userType"
                                    value={formData.userType}
                                    onChange={handleInputChange('userType')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                                    required
                                >
                                    <option value="comunidade">Membro da Comunidade</option>
                                    <option value="mediador">Mediador</option>
                                    <option value="coordenacao">Coordenação</option>
                                </select>
                            </div>

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
                            />

                            <Input
                                label="Telefone"
                                id="phone"
                                type="tel"
                                name="phone"
                                placeholder="(11) 99999-9999"
                                value={formData.phone}
                                onChange={handleInputChange('phone')}
                            />

                            {formData.userType === 'coordenacao' && (
                                <Input
                                    label="Departamento"
                                    id="department"
                                    type="text"
                                    name="department"
                                    placeholder="Ex: Análise e Desenvolvimento de Sistemas"
                                    required={true}
                                    value={formData.department}
                                    onChange={handleInputChange('department')}
                                    error={errors.department}
                                    description="Informe o departamento que você representa"
                                />
                            )}

                            {formData.userType === 'mediador' && (
                                <Input
                                    label="Especialização"
                                    id="specialization"
                                    type="text"
                                    name="specialization"
                                    placeholder="Ex: Tecnologia e Inovação, Sustentabilidade"
                                    required={true}
                                    value={formData.specialization}
                                    onChange={handleInputChange('specialization')}
                                    error={errors.specialization}
                                    description="Informe sua área de especialização"
                                />
                            )}

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