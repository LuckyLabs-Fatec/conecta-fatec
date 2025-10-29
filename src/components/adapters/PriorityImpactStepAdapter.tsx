import React from 'react';
import { UseFormSetValue, FieldPath, FieldPathValue, FieldErrors } from 'react-hook-form';
import { PriorityImpactStep } from '@/components';
import { SuggestionSchema } from '@/domain/ideas/schemas/suggestion.schema';

interface Props {
  setValue: UseFormSetValue<SuggestionSchema>;
  values: Partial<SuggestionSchema>;
  errors: FieldErrors<SuggestionSchema>;
  onImageUpload: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
}

export const PriorityImpactStepAdapter = ({ setValue, values, errors, onImageUpload, onRemoveImage }: Props) => {
  const onChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = (e.target as HTMLInputElement).value;
    let path: FieldPath<SuggestionSchema> | null = null;
    if (field === 'priority' || field === 'affectedPeople' || field === 'frequency') {
      path = field as FieldPath<SuggestionSchema>;
    }
    if (path) {
      setValue(path, value as FieldPathValue<SuggestionSchema, typeof path>, { shouldValidate: true });
    }
  };

  const formData: {
    priority: 'baixa' | 'media' | 'alta' | 'urgente';
    affectedPeople: string;
    frequency: 'unica' | 'semanal' | 'diaria' | 'constante';
    images: File[];
  } = {
    priority: (values.priority as 'baixa' | 'media' | 'alta' | 'urgente') ?? 'media',
    affectedPeople: (values.affectedPeople as string) ?? '',
    frequency: (values.frequency as 'unica' | 'semanal' | 'diaria' | 'constante') ?? 'unica',
    images: (values.images as File[]) ?? []
  };

  const flatErrors = {
    affectedPeople: (errors.affectedPeople?.message as string) || ''
  };

  return (
    <PriorityImpactStep
      formData={formData}
      errors={flatErrors}
      onChange={onChange}
      onImageUpload={(e) => onImageUpload((e.target as HTMLInputElement).files)}
      onRemoveImage={onRemoveImage}
    />
  );
};

export default PriorityImpactStepAdapter;
