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
          className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-[#CB2616] focus-within:border-[#CB2616] ${
            value === category.value ? 'border-[#CB2616] bg-red-50' : 'border-gray-300 hover:border-gray-400'
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
          <span className="font-medium text-gray-800">{category.label}</span>
          {category.description && (
            <span id={`category-${category.value}-desc`} className="text-sm text-gray-500">
              {category.description}
            </span>
          )}
          <span className="sr-only">Selecionar categoria {category.label}</span>
        </label>
      ))}
    </div>
  );
}
