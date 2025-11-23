import { Input } from "../../atoms/Input";

interface ImprovementDetailsStepProps {
    formData: {
        title: string;
        description: string;
        attachments: File[];
    };
    errors: { [key: string]: string };
    onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onAttachmentUpload: (files: FileList | null) => void;
    onRemoveAttachment: (index: number) => void;
}

export const ImprovementDetailsStep = ({ formData, errors, onChange, onAttachmentUpload, onRemoveAttachment }: ImprovementDetailsStepProps) => {
    return (
        <div className="space-y-6" role="group" aria-labelledby="improvement-details-heading">
            <h2 id="improvement-details-heading" className="text-xl font-semibold text-gray-800 mb-4">
                Detalhes da sua proposta
            </h2>

            <Input
                label="Título da sua proposta"
                id="title"
                placeholder="Ex: Sistema para gestão de centro de adoção de animais"
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
                    placeholder="Descreva sua proposta: como funcionaria, quem seria beneficiado, que recursos seriam necessários."
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
                    Inclua informações como: Motivos para a melhoria, benefícios esperados, público-alvo, etc.
                </p>
            </div>

            {/* Attachments Upload */}
            <div>
                <label htmlFor="attachments-upload" className="block text-sm font-medium text-gray-700 mb-2">
                    Anexos (opcional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                        Adicione até 5 arquivos (imagens, PDFs, etc.)
                    </p>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => onAttachmentUpload(e.target.files)}
                        className="hidden"
                        id="attachments-upload"
                        aria-describedby="attachments-upload-help"
                    />
                    <label
                        htmlFor="attachments-upload"
                        className="inline-block px-4 py-2 bg-[#CB2616] text-white rounded-lg cursor-pointer hover:bg-red-700 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-[#CB2616] focus-within:ring-offset-2"
                    >
                        Selecionar Arquivos
                    </label>
                    <p id="attachments-upload-help" className="sr-only">
                        Selecione até 5 arquivos de suporte
                    </p>
                </div>

                {formData.attachments.length > 0 && (
                    <ul className="mt-4 space-y-2">
                        {formData.attachments.map((file, idx) => (
                            <li key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm">
                                <span className="truncate mr-3">{file.name}</span>
                                <button
                                    type="button"
                                    onClick={() => onRemoveAttachment(idx)}
                                    className="text-red-600 hover:text-red-700"
                                    aria-label={`Remover anexo ${idx + 1}`}
                                >
                                    Remover
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
