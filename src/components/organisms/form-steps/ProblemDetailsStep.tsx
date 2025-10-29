import { Input } from "../../atoms/Input";

interface ProblemDetailsStepProps {
    formData: {
        category: string;
        title: string;
        description: string;
    };
    errors: { [key: string]: string };
    onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PROBLEM_CATEGORIES = [
    { value: 'infraestrutura', label: 'Infraestrutura Urbana', description: 'Buracos, calçadas, iluminação' },
    { value: 'seguranca', label: 'Segurança Pública', description: 'Crimes, falta de policiamento' },
    { value: 'ambiente', label: 'Meio Ambiente', description: 'Poluição, lixo, áreas verdes' },
    { value: 'transporte', label: 'Transporte Público', description: 'Ônibus, pontos, acessibilidade' },
    { value: 'saude', label: 'Saúde Comunitária', description: 'Postos, saneamento, epidemias' },
    { value: 'educacao', label: 'Educação', description: 'Escolas, bibliotecas, creches' },
    { value: 'outros', label: 'Outros', description: 'Problemas não listados acima' }
];

export const ProblemDetailsStep = ({ formData, errors, onChange }: ProblemDetailsStepProps) => (
    <div className="space-y-6" role="group" aria-labelledby="problem-details-heading">
        <h2 id="problem-details-heading" className="text-xl font-semibold text-gray-800 mb-4">
            Detalhes do Problema
        </h2>

        <div>
            <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-3">
                    Categoria do problema *
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3" role="radiogroup" aria-required="true">
                    {PROBLEM_CATEGORIES.map(category => (
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
            label="Título do problema"
            id="title"
            placeholder="Ex: Buraco na Rua das Flores causa acidentes"
            required={true}
            value={formData.title}
            onChange={onChange('title')}
            error={errors.title}
            description="Seja claro e específico no título"
        />

        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição detalhada *
            </label>
            <textarea
                id="description"
                value={formData.description}
                onChange={onChange('description')}
                placeholder="Descreva o problema em detalhes: quando acontece, como afeta as pessoas, há quanto tempo existe..."
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
                Inclua informações como: quando o problema acontece, quem é afetado, e qual o impacto
            </p>
        </div>
    </div>
);
