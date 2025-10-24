"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Formik, FormikHelpers, FormikProps } from "formik";
type FormValues = {
  title: string;
  description: string;
  email: string;
};
import { Input } from "@/components/Input";
import { Header } from "@/components/Header";

export default function SimpleFormPage() {
  const router = useRouter();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4 text-black">Enviar ideia</h1>

          <Formik
            initialValues={{ title: "", description: "", email: "" }}
            validate={(values: FormValues) => {
              const errors: Record<string, string> = {};
              if (!values.title) errors.title = "Título obrigatório";
              if (!values.description) errors.description = "Descrição obrigatória";
              if (!values.email) {
                errors.email = "Email obrigatório";
              } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = "Email inválido";
              }
              return errors;
            }}
            onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
              setSubmitting(true);
              window.alert("Ideia enviada com sucesso!");
              router.push("/acompanhar-projetos");
              setSubmitting(false);
            }}
          >
            {(props: FormikProps<FormValues>) => {
              const { values, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched } = props;

              return (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Input
                    label="Título"
                    id="title"
                    name="title"
                    placeholder="Título da ideia"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && errors.title ? errors.title : undefined}
                    required
                  />

                  <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Descrição
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Descreva sua ideia..."
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      rows={6}
                      className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] ${touched.description && errors.description ? "border-red-500 focus:ring-red-500" : "border-gray-300 hover:border-gray-400"
                        }`}
                    />
                    {touched.description && errors.description && (
                      <div className="text-sm text-red-600" role="alert">
                        {errors.description}
                      </div>
                    )}
                  </div>

                  <Input
                    label="Email para contato"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && errors.email ? errors.email : undefined}
                    required
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
            }}
          </Formik>
        </div>
      </main>
    </>
  );
}
