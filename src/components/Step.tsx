interface StepProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export const Step: React.FC<StepProps> = ({ icon, title, description }) => {
    return (
        <div className="flex flex-col items-center text-center p-4 border rounded-lg shadow-md bg-white min-h-[200px]">
            <div className="mb-4">
            {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
            <p className="text-gray-800">{description}</p>
        </div>
    );
};
