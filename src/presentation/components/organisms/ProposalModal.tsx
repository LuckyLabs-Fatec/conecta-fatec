/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState, useEffect } from 'react';
import { Proposal, ProposalStatus } from "@/domain/proposals/types";
import { useAuth } from "@/presentation/hooks/useAuth";
import Image from "next/image";
import { Button } from "@/presentation/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface ProposalModalProps {
    proposal: Proposal;
    onClose: () => void;
    onUpdateStatus?: (status: ProposalStatus, message?: string) => void;
    onAssign?: (assignmentData: any) => void;
}

const statusConfig: Record<ProposalStatus, { label: string; color: string }> = {
    pendente: { label: 'Pendente', color: 'bg-gray-100 text-gray-800' },
    em_analise: { label: 'Em Análise', color: 'bg-blue-100 text-blue-800' },
    aguardando_info: { label: 'Aguardando Info', color: 'bg-yellow-100 text-yellow-800' },
    aprovada: { label: 'Aprovada', color: 'bg-green-100 text-green-800' },
    rejeitada: { label: 'Rejeitada', color: 'bg-red-100 text-red-800' },
    atribuida: { label: 'Atribuída', color: 'bg-purple-100 text-purple-800' },
};

const reviewSchema = z.object({
    message: z.string().min(1, "Mensagem é obrigatória"),
});

type ReviewSchema = z.infer<typeof reviewSchema>;

export const ProposalModal = ({ proposal, onClose, onUpdateStatus, onAssign }: ProposalModalProps) => {
    const { hasPermission } = useAuth();
    const [action, setAction] = useState<'approve' | 'reject' | 'assign' | 'request_info' | null>(null);

    const reviewForm = useForm<ReviewSchema>({
        resolver: zodResolver(reviewSchema),
        defaultValues: { message: '' },
        mode: 'onChange',
    });

    const [assignmentData, setAssignmentData] = useState({
        class: '',
        semester: '',
        course: '',
        professor: ''
    });

    const isCoordinator = hasPermission('coordenador');
    const isMediator = hasPermission('mediador');

    const canReview = isCoordinator || isMediator;
    const canAssign = isCoordinator && proposal.status === 'aprovada';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    useEffect(() => {
        if (action === 'approve' || action === 'reject' || action === 'request_info') {
            reviewForm.reset({ message: '' });
        }
    }, [action, reviewForm]);

    const submitReview = reviewForm.handleSubmit((values) => {
        if (!onUpdateStatus) return;

        if (action === 'approve') {
            onUpdateStatus('aprovada', values.message);
        } else if (action === 'reject') {
            onUpdateStatus('rejeitada', values.message);
        } else if (action === 'request_info') {
            onUpdateStatus('aguardando_info', values.message);
        }
    });

    const handleAssignment = () => {
        if (onAssign) {
            onAssign(assignmentData);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
            tabIndex={-1}
        >
            <div
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
                onClick={(e) => e.stopPropagation()}
                role="document"
            >
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">{proposal.title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                        >
                            ×
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Descrição</h3>
                            <p className="text-gray-600 mb-4">{proposal.description}</p>

                            <h3 className="font-semibold text-gray-800 mb-2">Submetida por</h3>
                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                <p className="font-medium">{proposal.submittedBy.name}</p>
                                <p className="text-sm text-gray-600">{proposal.submittedBy.email}</p>
                                {proposal.submittedBy.phone && (
                                    <p className="text-sm text-gray-600">{proposal.submittedBy.phone}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="mb-4">
                                <h4 className="font-medium text-gray-700">Status</h4>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig[proposal.status].color}`}>
                                    {statusConfig[proposal.status].label}
                                </span>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-medium text-gray-700 mb-2">Data de Submissão</h4>
                                <p className="text-gray-600">{formatDate(proposal.submittedAt)}</p>
                            </div>

                            {proposal.mediatorNotes && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-2">Notas do Mediador</h4>
                                    <p className="text-gray-600 bg-blue-50 p-3 rounded-lg">{proposal.mediatorNotes}</p>
                                </div>
                            )}

                            {proposal.coordinatorNotes && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-2">Notas da Coordenação</h4>
                                    <p className="text-gray-600 bg-green-50 p-3 rounded-lg">{proposal.coordinatorNotes}</p>
                                </div>
                            )}

                            {proposal.assignedTo && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-2">Atribuição</h4>
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                        <p className="font-medium">{proposal.assignedTo.class}</p>
                                        <p className="text-sm text-gray-600">{proposal.assignedTo.course}</p>
                                        <p className="text-sm text-gray-600">Professor: {proposal.assignedTo.professor}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {proposal.images.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3">Imagens</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {proposal.images.map((image, index) => (
                                    <Image
                                        key={index}
                                        src={image}
                                        alt={`Imagem ${index + 1} da proposta`}
                                        className="w-full h-48 object-cover rounded-lg"
                                        width={300}
                                        height={192}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Section */}
                    {canReview && proposal.status !== 'atribuida' && (
                        <div className="border-t pt-6">
                            <h3 className="font-semibold text-gray-800 mb-4">Ações</h3>

                            {!action && (
                                <div className="flex gap-3 flex-wrap">
                                    <Button
                                        label="Aprovar"
                                        onClick={() => setAction('approve')}
                                        variant="primary"
                                        size="medium"
                                    />
                                    <Button
                                        label="Rejeitar"
                                        onClick={() => setAction('reject')}
                                        variant="secondary"
                                        size="medium"
                                    />
                                    <Button
                                        label="Solicitar Informações"
                                        onClick={() => setAction('request_info')}
                                        variant="secondary"
                                        size="medium"
                                    />
                                    {canAssign && (
                                        <Button
                                            label="Atribuir à Turma"
                                            onClick={() => setAction('assign')}
                                            variant="primary"
                                            size="medium"
                                        />
                                    )}
                                </div>
                            )}

                            {(action === 'approve' || action === 'reject' || action === 'request_info') && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {action === 'approve'
                                                ? 'Notas de Aprovação'
                                                : action === 'reject'
                                                    ? 'Motivo da Rejeição'
                                                    : 'Solicitação de Informações'}
                                        </label>
                                        <textarea
                                            {...reviewForm.register('message')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                                            rows={4}
                                            placeholder={action === 'approve' ? 'Adicione observações sobre a aprovação...' : action === 'reject' ? 'Explique o motivo da rejeição...' : 'Descreva quais informações complementares são necessárias...'}
                                        />
                                        {reviewForm.formState.errors.message && (
                                            <p className="mt-1 text-xs text-red-600">{reviewForm.formState.errors.message.message}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            label={action === 'approve' ? 'Confirmar Aprovação' : action === 'reject' ? 'Confirmar Rejeição' : 'Solicitar Informações'}
                                            onClick={submitReview}
                                            variant="primary"
                                            size="medium"
                                        />
                                        <Button
                                            label="Cancelar"
                                            onClick={() => setAction(null)}
                                            variant="secondary"
                                            size="medium"
                                        />
                                    </div>
                                </div>
                            )}

                            {action === 'assign' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-2">Turma</label>
                                            <select
                                                id="class-select"
                                                value={assignmentData.class}
                                                onChange={(e) => setAssignmentData(prev => ({ ...prev, class: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                                            >
                                                <option value="">Selecione a turma</option>
                                                <option value="3º DSM">3º DSM</option>
                                                <option value="4º DSM">4º DSM</option>
                                                <option value="5º DSM">5º DSM</option>
                                                <option value="6º DSM">6º DSM</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="course-input" className="block text-sm font-medium text-gray-700 mb-2">Curso</label>
                                            <input
                                                id="course-input"
                                                type="text"
                                                value={assignmentData.course}
                                                onChange={(e) => setAssignmentData(prev => ({ ...prev, course: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                                                placeholder="Ex: Desenvolvimento de Software Multiplataforma"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="professor-input" className="block text-sm font-medium text-gray-700 mb-2">Professor Responsável</label>
                                        <input
                                            id="professor-input"
                                            type="text"
                                            value={assignmentData.professor}
                                            onChange={(e) => setAssignmentData(prev => ({ ...prev, professor: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                                            placeholder="Ex: Prof. Dr. João Silva"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            label="Atribuir à Turma"
                                            onClick={handleAssignment}
                                            variant="primary"
                                            size="medium"
                                        />
                                        <Button
                                            label="Cancelar"
                                            onClick={() => setAction(null)}
                                            variant="secondary"
                                            size="medium"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
