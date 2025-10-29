import { Input } from "../../atoms/Input";

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

export const ImprovementDetailsStep = ({ formData, errors, onChange }: ImprovementDetailsStepProps) => (
    <div className="space-y-6" role="group" aria-labelledby="improvement-details-heading">
        <h2 id="improvement-details-heading" className="text-xl font-semibold text-gray-800 mb-4">
            Detalhes da Sua Ideia
        </h2>

        <div>
            <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-3">
                    Categoria da melhoria *
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3" role="radiogroup" aria-required="true">
                    {IMPROVEMENT_CATEGORIES.map(category => (
                        <label
                            key={category.value}
                            className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors
                                ${formData.category === category.value
                                    ? 'border-[#CB2616] bg-red-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <input
                                type="radio"
                                name="category"
                                value={category.value}
                                checked={formData.category === category.value}
                                onChange={onChange('category')}
                                className="sr-only"
                                aria-describedby={`category-${category.value}-desc`}
                            />
                            <span className="font-medium text-gray-800">{category.label}</span>
                            <span id={`category-${category.value}-desc`} className="text-sm text-gray-500">
                                {category.description}
                            </span>
                            <span className="sr-only">Selecionar categoria {category.label}</span>
                        </label>
                    ))}
                </div>
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
