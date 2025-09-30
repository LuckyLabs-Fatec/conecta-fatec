interface StepProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export const Step: React.FC<StepProps> = ({ icon, title, description }) => {
    return (
        <div className="flex flex-col items-center text-center p-4 border rounded-lg shadow-md bg-white">
            <div className="mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};
