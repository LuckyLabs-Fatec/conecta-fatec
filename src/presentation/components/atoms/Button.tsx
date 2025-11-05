interface ButtonProps {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    variant: 'primary' | 'secondary';
    size: 'small' | 'medium' | 'large';
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false, variant, size, type = 'button', className }) => {
    const baseClasses = "rounded font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2";
    const sizeClasses = size === 'small'
        ? "px-2 py-1 text-sm"
        : size === 'medium'
            ? "px-4 py-2 text-base"
            : "px-6 py-3 text-lg";
    const variantClasses = variant === 'primary'
        ? "bg-[var(--cps-blue-base)] text-white hover:bg-[var(--cps-blue-title-hover)] focus:ring-[var(--cps-blue-title-hover)]"
        : "bg-white text-[var(--cps-blue-base)] border border-[var(--cps-blue-base)] hover:bg-gray-100 focus:ring-[var(--cps-blue-title-hover)]";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

    return (
        <button
            className={`${baseClasses} ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {label}
        </button>
    );
};
