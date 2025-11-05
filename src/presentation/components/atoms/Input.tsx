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
    w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200
    focus:ring-2 focus:ring-[var(--cps-blue-hover-text)] focus:border-[var(--cps-blue-hover-text)]
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
    ${error 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 hover:border-gray-400'
    }
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Field.Root className="flex flex-col gap-2">
      <Field.Label 
        htmlFor={id} 
        className="text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="obrigatório">*</span>
        )}
      </Field.Label>
      
      {description && (
        <Field.Description className="text-sm text-gray-600">
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
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </Field.Error>
      )}
    </Field.Root>
  );
});

Input.displayName = 'Input';
