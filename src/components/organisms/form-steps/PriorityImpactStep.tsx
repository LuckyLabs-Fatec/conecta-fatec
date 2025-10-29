import { Camera } from "lucide-react";
import Image from "next/image";

interface PriorityImpactStepProps {
    formData: {
        priority: 'baixa' | 'media' | 'alta' | 'urgente';
        affectedPeople: string;
        frequency: 'unica' | 'semanal' | 'diaria' | 'constante';
        images: File[];
    };
    errors: { [key: string]: string };
    onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (index: number) => void;
}

const PRIORITY_LEVELS = [
    { value: 'baixa', label: 'Baixa', description: 'Problema que pode aguardar solução', color: 'bg-green-100 text-green-800' },
    { value: 'media', label: 'Média', description: 'Problema que precisa de atenção', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'alta', label: 'Alta', description: 'Problema que requer solução rápida', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgente', label: 'Urgente', description: 'Problema que oferece risco imediato', color: 'bg-red-100 text-red-800' }
];

export const PriorityImpactStep = ({ formData, errors, onChange, onImageUpload, onRemoveImage }: PriorityImpactStepProps) => (
    <div className="space-y-6" role="group" aria-labelledby="priority-impact-heading">
        <h2 id="priority-impact-heading" className="text-xl font-semibold text-gray-800 mb-4">
            Impacto e Prioridade
        </h2>

        <div>
            <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-3">
                    Nível de prioridade *
                </legend>
                <div className="space-y-3" role="radiogroup" aria-required="true">
                    {PRIORITY_LEVELS.map(priority => (
                        <label
                            key={priority.value}
                            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors
                                ${formData.priority === priority.value
                                    ? 'border-[#CB2616] bg-red-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <input
                                type="radio"
                                name="priority"
                                value={priority.value}
                                checked={formData.priority === priority.value}
                                onChange={onChange('priority')}
                                className="sr-only"
                                aria-describedby={`priority-${priority.value}-desc`}
                            />
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.color}`}>
                                    {priority.label}
                                </span>
                                <span id={`priority-${priority.value}-desc`} className="text-sm text-gray-600">
                                    {priority.description}
                                </span>
                            </div>
                            <span className="sr-only">Selecionar prioridade {priority.label}</span>
                        </label>
                    ))}
                </div>
            </fieldset>
        </div>

        <div>
            <label htmlFor="affectedPeople" className="block text-sm font-medium text-gray-700 mb-2">
                Quantas pessoas são afetadas? *
            </label>
            <textarea
                id="affectedPeople"
                value={formData.affectedPeople}
                onChange={onChange('affectedPeople')}
                placeholder="Ex: Cerca de 200 moradores da rua, estudantes que passam pelo local, comerciantes da região..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none transition-colors"
                required
                aria-describedby="affected-people-help"
            />
            {errors.affectedPeople && (
                <p className="text-sm text-red-600 mt-1" role="alert" aria-live="polite">
                    {errors.affectedPeople}
                </p>
            )}
        </div>

        <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                Frequência do problema
            </label>
            <select
                id="frequency"
                value={formData.frequency}
                onChange={onChange('frequency')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none transition-colors"
                aria-describedby="frequency-help"
            >
                <option value="unica">Ocorrência única</option>
                <option value="semanal">Acontece semanalmente</option>
                <option value="diaria">Acontece diariamente</option>
                <option value="constante">Problema constante</option>
            </select>
        </div>

        {/* Image Upload */}
        <div>
            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Fotos do problema (opcional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="mx-auto text-gray-400 mb-2" size={32} aria-hidden="true" />
                <p className="text-sm text-gray-600 mb-2">
                    Adicione até 5 fotos para ajudar na análise
                </p>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={onImageUpload}
                    className="hidden"
                    id="image-upload"
                    aria-describedby="image-upload-help"
                />
                <label
                    htmlFor="image-upload"
                    className="inline-block px-4 py-2 bg-[#CB2616] text-white rounded-lg cursor-pointer hover:bg-red-700 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-[#CB2616] focus-within:ring-offset-2"
                >
                    Selecionar Fotos
                </label>
                <p id="image-upload-help" className="sr-only">
                    Selecione até 5 imagens no formato JPG, PNG ou GIF
                </p>
            </div>
            
            {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4" role="list">
                    {formData.images.map((image, index) => (
                        <div key={index} className="relative group" role="listitem">
                            <Image
                                src={URL.createObjectURL(image)}
                                alt={`Foto do problema ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                                width={120}
                                height={96}
                            />
                            <button
                                type="button"
                                onClick={() => onRemoveImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                                aria-label={`Remover foto ${index + 1}`}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);
