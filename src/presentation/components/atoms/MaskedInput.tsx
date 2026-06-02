'use client';
import React, { useCallback } from 'react';

export interface MaskConfig {
  pattern: string | ((value: string) => string);
  charRegex: RegExp;
  placeholder?: string;
}

interface MaskedInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maskConfig: MaskConfig;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  description?: string;
  className?: string;
}

export const MaskedInput: React.FC<MaskedInputProps> = ({
  label,
  id,
  value,
  onChange,
  maskConfig,
  required = false,
  disabled = false,
  error,
  description,
  className = '',
}) => {
  const applyMask = useCallback((rawValue: string): string => {
    const cleanValue = rawValue.replace(/\D/g, '');

    const pattern = typeof maskConfig.pattern === 'function'
      ? maskConfig.pattern(cleanValue)
      : maskConfig.pattern;

    let masked = '';
    let valueIndex = 0;

    for (let i = 0; i < pattern.length && valueIndex < cleanValue.length; i++) {
      if (pattern[i] === 'x') {
        masked += cleanValue[valueIndex];
        valueIndex++;
      } else {
        masked += pattern[i];
      }
    }

    return masked;
  }, [maskConfig]);

  const removeMask = (maskedValue: string): string => {
    return maskedValue.replace(/\D/g, '');
  };

  const displayValue = value ? applyMask(value) : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleanValue = removeMask(inputValue);

    if (cleanValue === '' || maskConfig.charRegex.test(cleanValue)) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: cleanValue,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--cps-gray-text)] mb-2">
        {label}
        {required && <span className="text-[var(--cps-red-base)] ml-1">*</span>}
      </label>
      <input
        id={id}
        type="text"
        value={displayValue}
        onChange={handleChange}
        disabled={disabled}
        placeholder={maskConfig.placeholder}
        className={`w-full px-4 py-3 border rounded-[30px] bg-white outline-none transition-colors ${error
          ? 'border-[var(--cps-feedback-cancelled)] focus:ring-2 focus:ring-[var(--cps-feedback-cancelled)]'
          : 'border-[var(--cps-gray-light)] focus:ring-2 focus:ring-[var(--cps-blue-highlight)] focus:border-[var(--cps-blue-base)]'
          } ${disabled ? 'bg-[var(--cps-gray-hover)] cursor-not-allowed' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-[var(--cps-feedback-cancelled)]">
          {error}
        </p>
      )}
      {description && !error && (
        <p id={`${id}-description`} className="mt-1 text-sm text-[var(--cps-gray-text)]">
          {description}
        </p>
      )}
    </div>
  );
};
