import { Camera, ChevronDown, Check } from "lucide-react";
import Image from "next/image";
import { Field } from "@base-ui-components/react/field";
import { Select } from "@base-ui-components/react/select";

interface PriorityImpactStepProps {
    formData: {
        affectedPeople: string;
        frequency: 'unica' | 'semanal' | 'diaria' | 'constante';
        images: File[];
    };
    errors: { [key: string]: string };
    onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (index: number) => void;
}

// Removido: UI de seleção de nível de prioridade

export const PriorityImpactStep = ({ formData, errors, onChange, onImageUpload, onRemoveImage }: PriorityImpactStepProps) => {
    const handleFrequencyChange = (val: string) => {
        const e = { target: { value: val } } as unknown as React.ChangeEvent<HTMLSelectElement>;
        onChange('frequency')(e);
    };

    return (
    <div className="space-y-6" role="group" aria-labelledby="priority-impact-heading">
        <h2 id="priority-impact-heading" className="text-xl font-semibold text-gray-800 mb-4">
            Impacto
        </h2>

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
            <Field.Root>
                <Field.Label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequência do problema
                </Field.Label>

                <Select.Root<string>
                    name="frequency"
                    value={formData.frequency}
                    onValueChange={handleFrequencyChange}
                    required={false}
                    modal
                    items={[
                        { value: 'unica', label: 'Ocorrência única' },
                        { value: 'semanal', label: 'Acontece semanalmente' },
                        { value: 'diaria', label: 'Acontece diariamente' },
                        { value: 'constante', label: 'Problema constante' }
                    ] as Array<{label: React.ReactNode; value: string}>}
                >
                    <Select.Trigger
                        className="w-full flex items-center justify-between gap-2 px-4 py-3 border rounded-lg bg-white text-left outline-none transition-all duration-200
                                   focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616]
                                   border-gray-300 hover:border-gray-400"
                        aria-describedby="frequency-help"
                    >
                        <Select.Value>
                            {(v) => ({
                                unica: 'Ocorrência única',
                                semanal: 'Acontece semanalmente',
                                diaria: 'Acontece diariamente',
                                constante: 'Problema constante',
                            } as Record<string, string>)[String(v)]}
                        </Select.Value>
                        <ChevronDown size={16} className="text-gray-500" aria-hidden="true" />
                    </Select.Trigger>

                    <Select.Portal>
                        <Select.Backdrop className="fixed inset-0 bg-black/20" />
                        <Select.Positioner className="z-50">
                            <Select.Popup className="mt-1 w-[var(--trigger-width)] max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg p-1">
                                {[
                                    { value: 'unica', label: 'Ocorrência única' },
                                    { value: 'semanal', label: 'Acontece semanalmente' },
                                    { value: 'diaria', label: 'Acontece diariamente' },
                                    { value: 'constante', label: 'Problema constante' }
                                ].map((opt) => (
                                    <Select.Item
                                        key={opt.value}
                                        value={opt.value}
                                        className="group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-800
                                                   data-[highlighted]:bg-gray-100 data-[selected]:bg-red-50"
                                    >
                                        <Select.ItemIndicator aria-hidden="true" className="opacity-0 group-data-[selected]:opacity-100">
                                            <Check size={16} className="text-[#CB2616]" />
                                        </Select.ItemIndicator>
                                        <Select.ItemText>{opt.label}</Select.ItemText>
                                    </Select.Item>
                                ))}
                            </Select.Popup>
                        </Select.Positioner>
                    </Select.Portal>
                </Select.Root>
            </Field.Root>
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
};
