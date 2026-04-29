import { Input } from "../../atoms/Input";
import { MaskedInput, type MaskConfig } from "../../atoms/MaskedInput";

const phoneMaskConfig: MaskConfig = {
    pattern: (value: string) => {
        return value.length <= 10 ? '(xx) xxxx-xxxx' : '(xx) xxxxx-xxxx';
    },
    charRegex: /^\d{0,11}$/,
    placeholder: '(11) 99999-9999'
};

interface ContactInfoStepProps {
    formData: {
        contact: {
            primaryEmail: string;
            secondaryEmail?: string;
            primaryPhone: string;
            secondaryPhone?: string;
            details?: string;
            primaryPhoneIsWhatsapp: boolean;
            secondaryPhoneIsWhatsapp?: boolean;
        };
    };
    errors: { [key: string]: string };
    onChange: (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onToggle: (subField: string, value: boolean) => void;
    hasPhone?: boolean;
}

export const ContactInfoStep = ({ formData, errors, onChange, onToggle, hasPhone = false }: ContactInfoStepProps) => (
    <div className="space-y-6" role="group" aria-labelledby="contact-info-heading">
        <h2 id="contact-info-heading" className="text-xl font-semibold text-gray-800 mb-4">
            Informações de Contato
        </h2>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6" role="note">
            <h3 className="font-medium text-amber-800 mb-2">🔒 Privacidade Garantida</h3>
            <p className="text-sm text-amber-700">
                Suas informações pessoais são protegidas e usadas apenas para contato sobre esta sugestão.
            </p>
        </div>

        <Input
            label="Email principal"
            id="primaryEmail"
            type="email"
            required={true}
            disabled={true}
            value={formData.contact.primaryEmail}
            onChange={onChange('contact', 'primaryEmail')}
            error={errors.primaryEmail}
            description="Este email está vinculado à sua conta"
        />

        <Input
            label="Segundo email (opcional)"
            id="secondaryEmail"
            type="email"
            placeholder="Opcional"
            value={formData.contact.secondaryEmail || ''}
            onChange={onChange('contact', 'secondaryEmail')}
            error={errors.secondaryEmail}
        />

        <MaskedInput
            label="Telefone principal"
            id="primaryPhone"
            required={true}
            disabled={hasPhone}
            value={formData.contact.primaryPhone}
            onChange={onChange('contact', 'primaryPhone')}
            maskConfig={phoneMaskConfig}
            error={errors.primaryPhone}
            description={hasPhone ? 'Este telefone está vinculado à sua conta' : undefined}
        />
        <div className="flex items-center gap-2 ml-1">
            <input
                id="primaryPhoneIsWhatsapp"
                type="checkbox"
                checked={formData.contact.primaryPhoneIsWhatsapp}
                onChange={(e) => onToggle('primaryPhoneIsWhatsapp', e.target.checked)}
                className="h-4 w-4 text-[#CB2616] focus:ring-[#CB2616] border-gray-300 rounded"
            />
            <label htmlFor="primaryPhoneIsWhatsapp" className="text-sm text-gray-600">
                WhatsApp
            </label>
        </div>

        <MaskedInput
            label="Segundo telefone (opcional)"
            id="secondaryPhone"
            value={formData.contact.secondaryPhone || ''}
            onChange={onChange('contact', 'secondaryPhone')}
            maskConfig={phoneMaskConfig}
        />
        <div className="flex items-center gap-2 ml-1">
            <input
                id="secondaryPhoneIsWhatsapp"
                type="checkbox"
                checked={!!formData.contact.secondaryPhoneIsWhatsapp}
                onChange={(e) => onToggle('secondaryPhoneIsWhatsapp', e.target.checked)}
                className="h-4 w-4 text-[#CB2616] focus:ring-[#CB2616] border-gray-300 rounded"
            />
            <label htmlFor="secondaryPhoneIsWhatsapp" className="text-sm text-gray-600">
                WhatsApp
            </label>
        </div>

        <div>
            <label htmlFor="contactDetails" className="block text-sm font-medium text-gray-700 mb-2">
                Detalhes adicionais de contato (opcional)
            </label>
            <textarea
                id="contactDetails"
                value={formData.contact.details || ''}
                onChange={onChange('contact', 'details')}
                placeholder="Preferências de horário, melhor meio de contato, etc."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none transition-colors"
                aria-describedby="contact-details-help"
            />
            <p id="contact-details-help" className="sr-only">
                Campo opcional para informações de contato adicionais
            </p>
        </div>
    </div>
);
