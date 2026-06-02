import { Field } from "@base-ui-components/react/field";
import { Input as BaseInput } from "@base-ui-components/react/input";
import { forwardRef } from "react";

export interface InputProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  name?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  description?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label,
  id,
  type = 'text',
  name,
  placeholder,
  required = false,
  disabled = false,
  error,
  description,
  value,
  onChange,
  onBlur,
  className = '',
  ...props
}, ref) => {
  const baseInputClasses = `
    w-full px-4 py-3 border rounded-[30px] bg-white outline-none transition-all duration-200
    focus:ring-2 focus:ring-[var(--cps-blue-highlight)] focus:border-[var(--cps-blue-base)]
    disabled:bg-[var(--cps-gray-hover)] disabled:cursor-not-allowed disabled:text-[var(--cps-gray-text)]
    ${error 
      ? 'border-[var(--cps-feedback-cancelled)] focus:ring-[var(--cps-feedback-cancelled)] focus:border-[var(--cps-feedback-cancelled)]' 
      : 'border-[var(--cps-gray-light)] hover:border-[var(--cps-blue-base)]'
    }
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Field.Root className="flex flex-col gap-2">
      <Field.Label 
        htmlFor={id} 
        className="text-sm font-medium text-[var(--cps-blue-base)]"
      >
        {label}
        {required && (
          <span className="text-[var(--cps-red-base)] ml-1" aria-label="obrigatório">*</span>
        )}
      </Field.Label>
      
      {description && (
        <Field.Description className="text-sm text-[var(--cps-gray-text)]">
          {description}
        </Field.Description>
      )}
      
      <BaseInput
        ref={ref}
        type={type}
        id={id}
        name={name || id}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={baseInputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      
      {error && (
        <Field.Error
          id={`${id}-error`}
          className="text-sm text-[var(--cps-feedback-cancelled)]"
          role="alert"
        >
          {error}
        </Field.Error>
      )}
    </Field.Root>
  );
});

Input.displayName = 'Input';
