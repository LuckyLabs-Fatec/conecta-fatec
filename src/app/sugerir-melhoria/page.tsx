
'use client';
import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@base-ui-components/react/form"
import { Header } from "@/presentation/components"
import { ImprovementDetailsStepAdapter } from '@/presentation/components/adapters/ImprovementDetailsStepAdapter'
import { ContactInfoStepAdapter } from '@/presentation/components/adapters/ContactInfoStepAdapter'
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { suggestionSchema, SuggestionSchema } from '@/domain/ideas/schemas/suggestion.schema';
import { useAuth } from "@/presentation/hooks/useAuth";

export default function SuggestImprovementPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 2;
    const { user } = useAuth();

    const { handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<SuggestionSchema>({
        resolver: zodResolver(suggestionSchema) as Resolver<SuggestionSchema>,
        defaultValues: {
            title: '',
            description: '',
            attachments: [],
            contact: {
                primaryEmail: user?.email || '',
                secondaryEmail: '',
                primaryPhone: '',
                secondaryPhone: '',
                details: '',
                primaryPhoneIsWhatsapp: false,
                secondaryPhoneIsWhatsapp: false,
            }
        }
    });

    const watchAll = watch();

    const validateStep = async (step: number): Promise<boolean> => {
        switch (step) {
            case 1:
                return await trigger(['title', 'description']);
            case 2:
                return await trigger(['contact.primaryEmail', 'contact.primaryPhone']);
            default:
                return true;
        }
    };

    const nextStep = async () => {
        const ok = await validateStep(currentStep);
        if (ok) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const onSubmit = (data: SuggestionSchema) => {
        console.log('Submitting improvement suggestion:', data);
        // Here you would submit to your backend
    };
    // Attachments are handled inside the details adapter

    const ProgressBar = () => (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                    Etapa {currentStep} de {totalSteps}
                </span>
                <span className="text-sm text-gray-500">
                    {Math.round((currentStep / totalSteps) * 100)}% concluído
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-[#CB2616] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Submeter uma proposta
                        </h1>
                        <p className="text-gray-600">
                            Cadastre a sua proposta. Estudantes da Fatec Votorantim podem transformar sua sugestão em um projeto real!
                        </p>
                    </div>

                    <ProgressBar />

                    <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Step 1: Improvement Details */}
                        {currentStep === 1 && (
                            <div className="space-y-6" role="group" aria-labelledby="improvement-details-heading">
                                <ImprovementDetailsStepAdapter
                                    setValue={setValue}
                                    values={{
                                        title: watchAll.title,
                                        description: watchAll.description,
                                        attachments: watchAll.attachments,
                                    }}
                                    errors={errors}

                                />
                            </div>
                        )}

                        {/* Step 2: Contact Information */}
                        {currentStep === 2 && (
                            <ContactInfoStepAdapter
                                setValue={setValue}
                                values={{ contact: watchAll.contact }}
                                errors={errors}
                            />
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                                <ChevronLeft size={16} />
                                Anterior
                            </button>

                            {currentStep < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#CB2616] text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Próximo
                                    <ChevronRight size={16} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-3 bg-[#CB2616] text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <Send size={16} />
                                    Enviar Sugestão
                                </button>
                            )}
                        </div>
                    </Form>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Dúvidas? Entre em contato:{' '}
                        <a href="mailto:contato@fatecconecta.com" className="text-[#CB2616] hover:underline">
                            contato@fatecconecta.com
                        </a>
                    </p>
                </div>
            </main>
        </>
    );
}
