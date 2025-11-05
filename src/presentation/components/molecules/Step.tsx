interface StepProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    stepNumber?: number;
}

export const Step: React.FC<StepProps> = ({ icon, title, description, stepNumber }) => {
    return (
        <div className="relative flex flex-col items-center text-center p-6 border rounded-lg shadow-md bg-white min-h-[220px]">
            {typeof stepNumber === 'number' && (
                <div
                    aria-hidden="true"
                    className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#DA3115] text-white font-bold shadow"
                    title={`Etapa ${stepNumber}`}
                >
                    {stepNumber}
                </div>
            )}
            <div className="mb-4 mt-3" aria-hidden="true">
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
            <p className="text-gray-700 leading-relaxed max-w-prose">{description}</p>
        </div>
    );
};
