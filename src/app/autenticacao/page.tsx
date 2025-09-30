'use client';
import { Field } from "@base-ui-components/react/field"
import { Form } from "@base-ui-components/react/form"
import { LoginAside } from "@/components/LoginAside"
import Link from "next/dist/client/link";

export default function LoginPage () {
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

                        <Form className="flex flex-col gap-6">
                            <Field.Root className="flex flex-col gap-2">
                                <Field.Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email
                                </Field.Label>
                                <Field.Control 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    placeholder="Digite seu email" 
                                    required 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none transition-colors"
                                />
                            </Field.Root>

                            <Field.Root className="flex flex-col gap-2">
                                <Field.Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    Senha
                                </Field.Label>
                                <Field.Control 
                                    type="password" 
                                    id="password" 
                                    name="password" 
                                    placeholder="Digite sua senha" 
                                    required 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none transition-colors"
                                />
                            </Field.Root>

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
                                className="w-full bg-[#CB2616] hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#CB2616] focus:ring-offset-2"
                            >
                                ENTRAR
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