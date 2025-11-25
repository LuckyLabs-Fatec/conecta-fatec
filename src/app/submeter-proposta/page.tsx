
'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@base-ui-components/react/form"
import { Header, useToast } from "@/presentation/components"
import { ImprovementDetailsStepAdapter } from '@/presentation/components/adapters/ImprovementDetailsStepAdapter'
import { ContactInfoStepAdapter } from '@/presentation/components/adapters/ContactInfoStepAdapter'
import { ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react";
import { suggestionSchema, SuggestionSchema } from '@/domain/ideas/schemas/suggestion.schema';
import { useAuth } from "@/presentation/hooks/useAuth";

export default function SuggestImprovementPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const totalSteps = 2;
    const { user } = useAuth();
    const { show } = useToast();

    const { handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<SuggestionSchema>({
        resolver: zodResolver(suggestionSchema) as Resolver<SuggestionSchema>,
        defaultValues: {
            title: '',
            description: '',
            attachments: [],
            contact: {
                primaryEmail: '',
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

    useEffect(() => {
        if (user?.email) {
            setValue('contact.primaryEmail', user.email);
        }
        if (user?.user_metadata?.phone) {
            setValue('contact.primaryPhone', user.user_metadata.phone);
        }
    }, [user, setValue]);

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

    const router = useRouter();
    const onSubmit = async (data: SuggestionSchema) => {
        setIsSubmitting(true);
        try {
            const userHadPhone = user?.user_metadata?.phone;
            let attachmentRefs = [];

            if (data.attachments && data.attachments.length > 0) {
                const formData = new FormData();
                data.attachments.forEach(file => formData.append('files', file));

                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.error || 'Falha ao fazer upload dos anexos');
                }

                const uploadData = await uploadResponse.json();
                attachmentRefs = uploadData.files;
            }

            const response = await fetch('/api/ideias-simples', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: data.title,
                    description: data.description,
                    contact: data.contact,
                    attachments: attachmentRefs,
                }),
            });

            if (response.ok) {
                if (!userHadPhone && data.contact.primaryPhone) {
                    try {
                        await fetch('/api/user-profile', {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                phone: data.contact.primaryPhone,
                                phone_is_whats: data.contact.primaryPhoneIsWhatsapp,
                            }),
                        });
                    } catch (profileError) {
                        console.error('Error updating user profile:', profileError);
                    }
                }

                show({
                    message: 'Sua proposta foi enviada com sucesso! Agora ela está aguardando revisão. Quando tivermos uma novidade você será notificado pelo seu email',
                    kind: 'success'
                });
                router.push('/');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro desconhecido');
            }
        } catch (error) {
            show({
                message: 'Erro ao enviar proposta',
                kind: 'error',
                error: error as Error
            });
            setIsSubmitting(false);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isValid = await trigger();

        if (isValid) {
            await handleSubmit(onSubmit)(e);
        } else {
            show({
                message: 'Por favor, preencha todos os campos obrigatórios corretamente.',
                kind: 'error'
            });
        }
    };

    const requiredFields = [
        { value: watchAll.title, label: 'Título' },
        { value: watchAll.description, label: 'Descrição' },
        { value: watchAll.contact?.primaryEmail, label: 'Email principal' },
        { value: watchAll.contact?.primaryPhone, label: 'Telefone principal' },
    ];

    const calculateProgress = (): number => {
        const filledFields = requiredFields.filter(field => {
            if (typeof field.value === 'string') {
                return field.value.trim().length > 0;
            }
            return !!field.value;
        }).length;

        const calculatedProgress = Math.round((filledFields / requiredFields.length) * 100);
        return Math.min(calculatedProgress, 95);
    };

    const progress = calculateProgress();

    const ProgressBar = () => (
        <div className="sticky top-0 z-40 bg-gray-50 py-4 mb-4 border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                        Etapa {currentStep} de {totalSteps}
                    </span>
                    <span className="text-sm text-gray-500">
                        {progress}% concluído
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-[#CB2616] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <ProgressBar />
            <main className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Submeter uma proposta
                        </h1>
                        <p className="text-gray-600">
                            Cadastre a sua proposta. Estudantes da Fatec Votorantim podem transformar sua proposta em um projeto real!
                        </p>
                    </div>

                    <Form onSubmit={handleFormSubmit} className="space-y-6">
                        {/* Passo 1: Detalhes da proposta */}
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

                        {/* Passo 2: Informação de contato */}
                        {currentStep === 2 && (
                            <ContactInfoStepAdapter
                                setValue={setValue}
                                values={{ contact: watchAll.contact }}
                                errors={errors}
                                hasPhone={!!user?.user_metadata?.phone}
                            />
                        )}

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
                                    key="next-btn"
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#CB2616] text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Próximo
                                    <ChevronRight size={16} />
                                </button>
                            ) : (
                                <button
                                    key="submit-btn"
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#CB2616] text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            Enviar proposta
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </Form>
                </div>
            </main>
        </>
    );
}
