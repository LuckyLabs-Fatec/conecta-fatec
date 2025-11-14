import React from 'react';
import { UseFormSetValue, FieldErrors, FieldPath, FieldPathValue } from 'react-hook-form';
import { ImprovementDetailsStep } from '@/presentation/components';
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
    if (field === 'title' || field === 'description') {
      path = field as FieldPath<SuggestionSchema>;
    }
    if (path) {
      setValue(path, value as FieldPathValue<SuggestionSchema, typeof path>, { shouldValidate: true });
    }
  };

  const onAttachmentUpload = (files: FileList | null) => {
    if (!files) return;
    const arr: File[] = Array.from(files).slice(0, 5);
    const path = 'attachments' as FieldPath<SuggestionSchema>;
    setValue(path, arr as unknown as FieldPathValue<SuggestionSchema, typeof path>, { shouldValidate: true });
  };

  const onRemoveAttachment = (index: number) => {
    const current: File[] = (values.attachments as File[]) || [];
    const next: File[] = current.filter((_, i) => i !== index);
    const path = 'attachments' as FieldPath<SuggestionSchema>;
    setValue(path, next as unknown as FieldPathValue<SuggestionSchema, typeof path>, { shouldValidate: true });
  };

  const formData = {
    title: (values.title as string) ?? '',
    description: (values.description as string) ?? '',
    attachments: (values.attachments as File[]) ?? []
  };

  const flatErrors = {
    title: (errors.title?.message as string) || '',
    description: (errors.description?.message as string) || ''
  };

  return (
    <ImprovementDetailsStep
      formData={formData}
      errors={flatErrors}
      onChange={onChange}
      onAttachmentUpload={onAttachmentUpload}
      onRemoveAttachment={onRemoveAttachment}
    />
  );
};

export default ImprovementDetailsStepAdapter;
