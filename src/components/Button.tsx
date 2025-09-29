interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false, variant }) => {
    const baseClasses = "px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantClasses = variant === 'primary'
        ? "bg-[var(--palette-red-600)] text-white hover:bg-[var(--palette-red-700)] focus:ring-[var(--palette-red-500)]"
        : "bg-white text-[var(--palette-red-600)] border border-[var(--palette-red-600)] hover:bg-gray-100 focus:ring-[var(--palette-red-500)]";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

    return (
        <button
            className={`${baseClasses} ${variantClasses} ${disabledClasses}`}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
};