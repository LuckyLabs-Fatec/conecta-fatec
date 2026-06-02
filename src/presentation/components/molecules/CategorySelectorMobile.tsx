"use client";
import React from 'react';
import { Field } from "@base-ui-components/react/field";
import { Select } from "@base-ui-components/react/select";
import { ChevronDown, Check } from "lucide-react";

export type Category = { value: string; label: string; description?: string };

export interface CategorySelectorProps {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
}

export function CategorySelectorMobile({ categories, value, onChange }: CategorySelectorProps) {
  return (
    <div className="md:hidden">
      <Field.Root>
        <Field.Label className="block text-sm font-medium text-[var(--cps-gray-text)] mb-2">
          Categoria da melhoria *
        </Field.Label>

        <Select.Root<string>
          name="category"
          value={value || (null as unknown as string)}
          onValueChange={(v) => onChange(v)}
          items={categories as unknown as Array<{label: React.ReactNode; value: string}>}
          required
          modal
        >
          <Select.Trigger
            className="w-full flex items-center justify-between gap-2 px-4 py-3 border rounded-[30px] bg-white text-left outline-none transition-all duration-200
                       focus:ring-2 focus:ring-[var(--cps-blue-highlight)] focus:border-[var(--cps-blue-base)]
                       border-[var(--cps-gray-light)] hover:border-[var(--cps-blue-base)]"
          >
            <Select.Value>
              {(v) => v 
                ? (categories.find(c => c.value === v)?.label ?? v) 
                : (<span className="text-[var(--cps-gray-text)]">Selecione uma categoria</span>)}
            </Select.Value>
            <ChevronDown size={16} className="text-[var(--cps-gray-text)]" aria-hidden="true" />
          </Select.Trigger>

          <Select.Portal>
            <Select.Backdrop className="fixed inset-0 bg-black/20" />
            <Select.Positioner className="z-50">
              <Select.Popup
                className="mt-1 w-[var(--trigger-width)] max-h-60 overflow-auto rounded-[30px] border border-[var(--cps-gray-light)] bg-white shadow-[var(--cps-shadow-1)] p-1"
              >
                {categories.map((c) => (
                  <Select.Item
                    key={c.value}
                    value={c.value}
                    className="group flex w-full items-center gap-2 rounded-[24px] px-3 py-2 text-sm text-[var(--cps-blue-base)]
                               data-[highlighted]:bg-[var(--cps-gray-hover)] data-[selected]:bg-[var(--cps-feedback-cancelled-light)]"
                  >
                    <Select.ItemIndicator aria-hidden="true" className="opacity-0 group-data-[selected]:opacity-100">
                      <Check size={16} className="text-[var(--cps-red-base)]" />
                    </Select.ItemIndicator>
                    <Select.ItemText>{c.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </Field.Root>
    </div>
  );
}
