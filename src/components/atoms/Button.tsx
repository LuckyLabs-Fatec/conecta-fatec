interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant: 'primary' | 'secondary';
    size: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false, variant, size }) => {
    const baseClasses = "rounded font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2";
    const sizeClasses = size === 'small'
        ? "px-2 py-1 text-sm"
        : size === 'medium'
            ? "px-4 py-2 text-base"
            : "px-6 py-3 text-lg";
    const variantClasses = variant === 'primary'
        ? "bg-[var(--palette-red-600)] text-white hover:bg-[var(--palette-red-700)] focus:ring-[var(--palette-red-500)]"
        : "bg-white text-[var(--palette-red-600)] border border-[var(--palette-red-600)] hover:bg-gray-100 focus:ring-[var(--palette-red-500)]";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

    return (
        <button
            className={`${baseClasses} ${sizeClasses} ${variantClasses} ${disabledClasses}`}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
};
