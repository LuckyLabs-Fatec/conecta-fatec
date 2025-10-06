'use client';
import { useState } from 'react';
import { Form } from "@base-ui-components/react/form"
import { Header } from "@/components/Header"
import { ImprovementDetailsStep } from "@/components/ImprovementDetailsStep"
import { LocationStep } from "@/components/LocationStep"
import { PriorityImpactStep } from "@/components/PriorityImpactStep"
import { ContactInfoStep } from "@/components/ContactInfoStep"
import { ChevronLeft, ChevronRight, Send } from "lucide-react";

interface ImprovementFormData {
    category: string;
    title: string;
    description: string;
    location: {
        address: string;
        neighborhood: string;
        city: string;
        coordinates?: { lat: number; lng: number };
    };
    priority: 'baixa' | 'media' | 'alta' | 'urgente';
    affectedPeople: string;
    frequency: 'unica' | 'semanal' | 'diaria' | 'constante';
    images: File[];
    contactInfo: {
        name: string;
        email: string;
        phone?: string;
        allowContact: boolean;
    };
}

export default function SuggestImprovementPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<ImprovementFormData>({
        category: '',
        title: '',
        description: '',
        location: {
            address: '',
            neighborhood: '',
            city: 'Votorantim'
        },
        priority: 'media',
        affectedPeople: '',
        frequency: 'unica',
        images: [],
        contactInfo: {
            name: '',
            email: '',
            phone: '',
            allowContact: true
        }
    });

    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const totalSteps = 4;

    const handleInputChange = (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (subField) {
            if (field === 'location') {
                setFormData(prev => ({
                    ...prev,
                    location: {
                        ...prev.location,
                        [subField]: e.target.value
                    }
                }));
            } else if (field === 'contactInfo') {
                setFormData(prev => ({
                    ...prev,
                    contactInfo: {
                        ...prev.contactInfo,
                        [subField]: e.target.value
                    }
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: e.target.value
            }));
        }
        
        // Clear errors
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...files].slice(0, 5) // Max 5 images
            }));
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const validateStep = (step: number): boolean => {
        const newErrors: {[key: string]: string} = {};

        switch (step) {
            case 1:
                if (!formData.category) newErrors.category = 'Selecione uma categoria';
                if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
                if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
                break;
            case 2:
                if (!formData.location.address.trim()) newErrors.address = 'Endereço é obrigatório';
                if (!formData.location.neighborhood.trim()) newErrors.neighborhood = 'Bairro é obrigatório';
                break;
            case 3:
                if (!formData.affectedPeople.trim()) newErrors.affectedPeople = 'Informe quantas pessoas serão beneficiadas';
                break;
            case 4:
                if (!formData.contactInfo.name.trim()) newErrors.name = 'Nome é obrigatório';
                if (!formData.contactInfo.email.trim()) newErrors.email = 'Email é obrigatório';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            console.log('Submitting improvement suggestion:', formData);
            // Here you would submit to your backend
        }
    };

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
                            Sugira uma Ideia de Melhoria
                        </h1>
                        <p className="text-gray-600">
                            Compartilhe sua ideia de melhoria para a comunidade. Estudantes da Fatec Votorantim podem transformar sua sugestão em um projeto real!
                        </p>
                    </div>

                        <ProgressBar />

                        <Form onSubmit={handleSubmit} className="space-y-6">
                            {/* Step 1: Improvement Details */}
                            {currentStep === 1 && (
                                <div className="space-y-6" role="group" aria-labelledby="improvement-details-heading">
                                    <h2 id="improvement-details-heading" className="text-xl font-semibold text-gray-800 mb-4">
                                        Detalhes da Sua Ideia
                                    </h2>
                                    <ImprovementDetailsStep
                                        formData={{
                                            category: formData.category,
                                            title: formData.title,
                                            description: formData.description,
                                        }}
                                        errors={errors}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            )}

                            {/* Step 2: Location */}
                            {currentStep === 2 && (
                                <LocationStep
                                    formData={{ location: formData.location }}
                                    errors={errors}
                                    onChange={handleInputChange}
                                />
                            )}

                            {/* Step 3: Priority and Impact */}
                            {currentStep === 3 && (
                                <div className="space-y-6" role="group" aria-labelledby="impact-priority-heading">
                                    <h2 id="impact-priority-heading" className="text-xl font-semibold text-gray-800 mb-4">
                                        Impacto e Benefícios
                                    </h2>
                                    <PriorityImpactStep
                                        formData={{
                                            priority: formData.priority,
                                            affectedPeople: formData.affectedPeople,
                                            frequency: formData.frequency,
                                            images: formData.images,
                                        }}
                                        errors={errors}
                                        onChange={handleInputChange}
                                        onImageUpload={handleImageUpload}
                                        onRemoveImage={removeImage}
                                    />
                                </div>
                            )}

                            {/* Step 4: Contact Information */}
                            {currentStep === 4 && (
                                <ContactInfoStep
                                    formData={{ contactInfo: formData.contactInfo }}
                                    errors={errors}
                                    onChange={handleInputChange}
                                    onAllowContactChange={(checked) => setFormData(prev => ({
                                        ...prev,
                                        contactInfo: {
                                            ...prev.contactInfo,
                                            allowContact: checked
                                        }
                                    }))}
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
