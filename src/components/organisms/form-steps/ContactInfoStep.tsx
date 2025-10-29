import { Input } from "../../atoms/Input";

interface ContactInfoStepProps {
    formData: {
        contactInfo: {
            name: string;
            email: string;
            phone?: string;
            allowContact: boolean;
        };
    };
    errors: { [key: string]: string };
    onChange: (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAllowContactChange: (checked: boolean) => void;
}

export const ContactInfoStep = ({ formData, errors, onChange, onAllowContactChange }: ContactInfoStepProps) => (
    <div className="space-y-6" role="group" aria-labelledby="contact-info-heading">
        <h2 id="contact-info-heading" className="text-xl font-semibold text-gray-800 mb-4">
            Informações de Contato
        </h2>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6" role="note">
            <h3 className="font-medium text-amber-800 mb-2">🔒 Privacidade Garantida</h3>
            <p className="text-sm text-amber-700">
                Suas informações pessoais são protegidas e usadas apenas para contato sobre este relato. 
                Você pode escolher permanecer anônimo.
            </p>
        </div>

        <Input
            label="Nome completo"
            id="name"
            placeholder="Seu nome completo"
            required={true}
            value={formData.contactInfo.name}
            onChange={onChange('contactInfo', 'name')}
            error={errors.name}
        />

        <Input
            label="Email"
            id="email"
            type="email"
            placeholder="seu@email.com"
            required={true}
            value={formData.contactInfo.email}
            onChange={onChange('contactInfo', 'email')}
            error={errors.email}
            description="Para receber atualizações sobre seu relato"
        />

        <Input
            label="Telefone"
            id="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={formData.contactInfo.phone}
            onChange={onChange('contactInfo', 'phone')}
            description="Opcional - Para contato em caso de dúvidas"
        />

        <div className="flex items-start gap-3">
            <input
                type="checkbox"
                id="allowContact"
                checked={formData.contactInfo.allowContact}
                onChange={(e) => onAllowContactChange(e.target.checked)}
                className="h-4 w-4 text-[#CB2616] focus:ring-[#CB2616] border-gray-300 rounded mt-0.5"
            />
            <label htmlFor="allowContact" className="text-sm text-gray-600 leading-relaxed">
                Autorizo o contato dos estudantes da Fatec para esclarecimentos adicionais sobre este problema
            </label>
        </div>
    </div>
);
