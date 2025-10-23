import React from 'react';
import { UseFormSetValue, FieldErrors, FieldPath, FieldPathValue } from 'react-hook-form';
import { ImprovementDetailsStep } from '@/components/ImprovementDetailsStep';
import { SuggestionSchema } from '@/domain/ideas/schemas/suggestion.schema';

interface Props {
  setValue: UseFormSetValue<SuggestionSchema>;
  values: Partial<SuggestionSchema>;
  errors: FieldErrors<SuggestionSchema>;
}

export const ImprovementDetailsStepAdapter = ({ setValue, values, errors }: Props) => {
  const onChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    let path: FieldPath<SuggestionSchema> | null = null;
    if (field === 'category' || field === 'title' || field === 'description') {
      path = field as FieldPath<SuggestionSchema>;
    }
    if (path) {
      setValue(path, value as FieldPathValue<SuggestionSchema, typeof path>, { shouldValidate: true });
    }
  };

  const formData = {
    category: (values.category as string) ?? '',
    title: (values.title as string) ?? '',
    description: (values.description as string) ?? ''
  };

  const flatErrors = {
    category: (errors.category?.message as string) || '',
    title: (errors.title?.message as string) || '',
    description: (errors.description?.message as string) || ''
  };

  return <ImprovementDetailsStep formData={formData} errors={flatErrors} onChange={onChange} />;
};

export default ImprovementDetailsStepAdapter;
