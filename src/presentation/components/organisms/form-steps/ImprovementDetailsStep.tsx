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
            <h2 id="improvement-details-heading" className="text-xl font-semibold text-[var(--cps-blue-base)] mb-4">
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
                <label htmlFor="description" className="block text-sm font-medium text-[var(--cps-gray-text)] mb-2">
                    Descrição detalhada da melhoria *
                </label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={onChange('description')}
                    placeholder="Descreva sua proposta: como funcionaria, quem seria beneficiado, que recursos seriam necessários."
                    rows={4}
                    className="w-full px-4 py-3 border border-[var(--cps-gray-light)] rounded-[30px] focus:ring-2 focus:ring-[var(--cps-blue-highlight)] focus:border-[var(--cps-blue-base)] outline-none transition-colors"
                    required
                    aria-describedby="description-help"
                />
                {errors.description && (
                    <p className="text-sm text-[var(--cps-feedback-cancelled)] mt-1" role="alert" aria-live="polite">
                        {errors.description}
                    </p>
                )}
                <p id="description-help" className="text-sm text-[var(--cps-gray-text)] mt-1">
                    Inclua informações como: Motivos para a melhoria, benefícios esperados, público-alvo, etc.
                </p>
            </div>

            {/* Attachments Upload */}
            <div>
                <label htmlFor="attachments-upload" className="block text-sm font-medium text-[var(--cps-gray-text)] mb-2">
                    Anexos (opcional)
                </label>
                <div className="border-2 border-dashed border-[var(--cps-gray-light)] rounded-[30px] p-6 text-center">
                    <p className="text-sm text-[var(--cps-gray-text)] mb-2">
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
                        className="inline-block px-4 py-2 bg-[var(--cps-red-base)] text-white rounded-[30px] cursor-pointer hover:bg-[var(--cps-red-dark-10)] transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--cps-blue-highlight)] focus-within:ring-offset-2"
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
                            <li key={idx} className="flex items-center justify-between bg-[var(--cps-silver-base)] border border-[var(--cps-gray-light)] rounded-[24px] px-3 py-2 text-sm">
                                <span className="truncate mr-3">{file.name}</span>
                                <button
                                    type="button"
                                    onClick={() => onRemoveAttachment(idx)}
                                    className="text-[var(--cps-feedback-cancelled)] hover:text-[var(--cps-feedback-cancelled)]"
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
