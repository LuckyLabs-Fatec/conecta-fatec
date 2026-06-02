import React from 'react';

export type Category = { value: string; label: string; description?: string };

export interface CategorySelectorProps {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
}

export function CategorySelectorDesktop({ categories, value, onChange }: CategorySelectorProps) {
  return (
    <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-3" role="radiogroup" aria-required="true">
      {categories.map((category) => (
        <label
          key={category.value}
          className={`relative flex flex-col p-4 border rounded-[30px] cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-[var(--cps-blue-highlight)] focus-within:border-[var(--cps-blue-base)] ${
            value === category.value ? 'border-[var(--cps-red-base)] bg-[var(--cps-feedback-cancelled-light)]' : 'border-[var(--cps-gray-light)] hover:border-[var(--cps-blue-base)]'
          }`}
        >
          <input
            type="radio"
            name="category"
            value={category.value}
            checked={value === category.value}
            onChange={() => onChange(category.value)}
            className="sr-only"
            aria-describedby={`category-${category.value}-desc`}
          />
          <span className="font-medium text-[var(--cps-blue-base)]">{category.label}</span>
          {category.description && (
            <span id={`category-${category.value}-desc`} className="text-sm text-[var(--cps-gray-text)]">
              {category.description}
            </span>
          )}
          <span className="sr-only">Selecionar categoria {category.label}</span>
        </label>
      ))}
    </div>
  );
}
