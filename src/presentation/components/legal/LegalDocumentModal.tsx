'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { PrivacyContent, TermsContent } from './LegalContent';

type LegalDocumentType = 'terms' | 'privacy';

interface LegalDocumentModalProps {
    type: LegalDocumentType;
    onClose: () => void;
}

const legalDocumentTitle: Record<LegalDocumentType, string> = {
    terms: 'Termos e Condições de Uso',
    privacy: 'Política de Privacidade',
};

export function LegalDocumentModal({ type, onClose }: LegalDocumentModalProps) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <button
                type="button"
                aria-label="Fechar documento"
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            <div
                className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[30px] bg-white shadow-[var(--cps-shadow-2)]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="legal-document-title"
            >
                <header className="flex items-center justify-between gap-4 border-b border-[var(--cps-gray-light)] px-6 py-4">
                    <h2 id="legal-document-title" className="text-xl font-bold text-[var(--cps-blue-base)]">
                        {legalDocumentTitle[type]}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-[24px] p-2 text-[var(--cps-gray-text)] transition-colors hover:bg-[var(--cps-gray-hover)] hover:text-[var(--cps-gray-text)] focus:outline-none focus:ring-2 focus:ring-[var(--cps-blue-base)]"
                        aria-label="Fechar"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </header>

                <div className="overflow-y-auto px-6 py-5">
                    {type === 'terms' ? <TermsContent /> : <PrivacyContent />}
                    <p className="border-t border-[var(--cps-gray-light)] pt-4 text-center text-sm text-[var(--cps-gray-text)]">
                        Última atualização: Dezembro de 2024
                    </p>
                </div>
            </div>
        </div>
    );
}

export type { LegalDocumentType };
