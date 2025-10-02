import { MapPin } from "lucide-react";
import { Input } from "./Input";

interface LocationStepProps {
    formData: {
        location: {
            address: string;
            neighborhood: string;
            city: string;
        };
    };
    errors: { [key: string]: string };
    onChange: (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LocationStep = ({ formData, errors, onChange }: LocationStepProps) => (
    <div className="space-y-6" role="group" aria-labelledby="location-heading">
        <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-[#CB2616]" size={24} aria-hidden="true" />
            <h2 id="location-heading" className="text-xl font-semibold text-gray-800">
                Localização do Problema
            </h2>
        </div>

        <Input
            label="Endereço completo"
            id="address"
            placeholder="Rua, número (se houver)"
            required={true}
            value={formData.location.address}
            onChange={onChange('location', 'address')}
            error={errors.address}
            description="Seja o mais específico possível"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
                label="Bairro"
                id="neighborhood"
                placeholder="Nome do bairro"
                required={true}
                value={formData.location.neighborhood}
                onChange={onChange('location', 'neighborhood')}
                error={errors.neighborhood}
            />

            <Input
                label="Cidade"
                id="city"
                value={formData.location.city}
                onChange={onChange('location', 'city')}
                disabled={true}
                description="Focamos em Votorantim"
            />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" role="note">
            <h3 className="font-medium text-blue-800 mb-2">💡 Dica de Localização</h3>
            <p className="text-sm text-blue-700">
                Quanto mais precisa a localização, mais fácil será para os estudantes 
                visitarem o local e desenvolverem uma solução adequada.
            </p>
        </div>
    </div>
);
