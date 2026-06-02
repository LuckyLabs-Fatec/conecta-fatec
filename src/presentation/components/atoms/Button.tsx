import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    label: string;
    variant: 'primary' | 'secondary';
    size: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    disabled = false,
    variant,
    size,
    type = 'button',
    className = '',
    ...props
}) => {
    const baseClasses = "rounded-[30px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    const sizeClasses = size === 'small'
        ? "px-3 py-2 text-sm"
        : size === 'medium'
            ? "px-5 py-2.5 text-base"
            : "px-7 py-3 text-lg";
    const variantClasses = variant === 'primary'
        ? "bg-[var(--cps-blue-base)] text-white shadow-[var(--cps-shadow-1)] hover:bg-[var(--cps-blue-title-hover)] focus:ring-[var(--cps-blue-highlight)]"
        : "bg-white text-[var(--cps-blue-base)] border border-[var(--cps-blue-base)] hover:bg-[var(--cps-gray-hover)] focus:ring-[var(--cps-blue-highlight)]";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

    return (
        <button
            className={`${baseClasses} ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`}
            onClick={onClick}
            disabled={disabled}
            type={type}
            {...props}
        >
            {label}
        </button>
    );
};
