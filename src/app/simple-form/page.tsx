"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
type FormValues = {
  title: string;
  description: string;
  email: string;
};
import { Input, Header } from "@/components";

export default function SimpleFormPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4 text-black">Enviar ideia</h1>
          <RHFForm />
        </div>
      </main>
    </>
  );
}

function RHFForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    mode: 'onBlur'
  });

  const onSubmit = () => {
    window.alert('Ideia enviada com sucesso!');
    router.push('/acompanhar-projetos');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Título"
        id="title"
        placeholder="Título da ideia"
        required
        {...register('title', { required: 'Título obrigatório' })}
        error={errors.title?.message}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Descrição
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          id="description"
          placeholder="Descreva sua ideia..."
          rows={6}
          className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'}`}
          {...register('description', { required: 'Descrição obrigatória' })}
        />
        {errors.description && (
          <div className="text-sm text-red-600" role="alert">
            {errors.description.message}
          </div>
        )}
      </div>

      <Input
        label="Email para contato"
        id="email"
        type="email"
        placeholder="seu@email.com"
        required
        {...register('email', {
          required: 'Email obrigatório',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email inválido'
          }
        })}
        error={errors.email?.message}
      />

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded font-semibold px-6 py-3 text-lg bg-[var(--palette-red-600)] text-white hover:bg-[var(--palette-red-700)]"
        >
          Enviar ideia
        </button>
      </div>
    </form>
  );
}
