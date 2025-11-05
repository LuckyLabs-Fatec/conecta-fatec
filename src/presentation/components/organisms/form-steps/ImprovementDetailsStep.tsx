import { Input } from "../../atoms/Input";
import { CategorySelectorMobile } from "@/presentation/components/molecules/CategorySelectorMobile";
import { CategorySelectorDesktop } from "@/presentation/components/molecules/CategorySelectorDesktop";

interface ImprovementDetailsStepProps {
    formData: {
        category: string;
        title: string;
        description: string;
    };
    errors: { [key: string]: string };
    onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const IMPROVEMENT_CATEGORIES = [
    { value: 'infraestrutura', label: 'Infraestrutura Urbana', description: 'Melhorias em ruas, calçadas, iluminação' },
    { value: 'seguranca', label: 'Segurança Pública', description: 'Iniciativas de segurança comunitária' },
    { value: 'ambiente', label: 'Meio Ambiente', description: 'Sustentabilidade, áreas verdes, reciclagem' },
    { value: 'transporte', label: 'Transporte Público', description: 'Melhorias no transporte e mobilidade' },
    { value: 'saude', label: 'Saúde Comunitária', description: 'Bem-estar, saúde pública, qualidade de vida' },
    { value: 'educacao', label: 'Educação', description: 'Educação, cultura, bibliotecas, esportes' },
    { value: 'tecnologia', label: 'Tecnologia e Inovação', description: 'Soluções digitais, conectividade' },
    { value: 'outros', label: 'Outros', description: 'Outras ideias de melhoria' }
];

export const ImprovementDetailsStep = ({ formData, errors, onChange }: ImprovementDetailsStepProps) => {
    const handleCategoryChange = (val: string) => {
        const e = { target: { value: val } } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange('category')(e);
    };

    return (
    <div className="space-y-6" role="group" aria-labelledby="improvement-details-heading">
        <h2 id="improvement-details-heading" className="text-xl font-semibold text-gray-800 mb-4">
            Detalhes da Sua Ideia
        </h2>

        <div>
            <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-3">
                    Categoria da melhoria *
                </legend>

                {/* Mobile and Desktop selectors as separate molecules */}
                                <CategorySelectorMobile
                                    categories={IMPROVEMENT_CATEGORIES}
                                    value={formData.category}
                                    onChange={handleCategoryChange}
                                />
                                <CategorySelectorDesktop
                                    categories={IMPROVEMENT_CATEGORIES}
                                    value={formData.category}
                                    onChange={handleCategoryChange}
                                />
            </fieldset>

            {errors.category && (
                <p className="text-sm text-red-600 mt-1" role="alert" aria-live="polite">
                    {errors.category}
                </p>
            )}
        </div>

        <Input
            label="Título da sua ideia"
            id="title"
            placeholder="Ex: Criação de horta comunitária na Praça Central"
            required={true}
            value={formData.title}
            onChange={onChange('title')}
            error={errors.title}
            description="Seja claro e específico sobre sua ideia"
        />

        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição detalhada da melhoria *
            </label>
            <textarea
                id="description"
                value={formData.description}
                onChange={onChange('description')}
                placeholder="Descreva sua ideia em detalhes: como funcionaria, quem seria beneficiado, que recursos seriam necessários..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none transition-colors"
                required
                aria-describedby="description-help"
            />
            {errors.description && (
                <p className="text-sm text-red-600 mt-1" role="alert" aria-live="polite">
                    {errors.description}
                </p>
            )}
            <p id="description-help" className="text-sm text-gray-500 mt-1">
                Inclua informações como: benefícios esperados, público-alvo, e como poderia ser implementada
            </p>
        </div>
    </div>
    );
};
