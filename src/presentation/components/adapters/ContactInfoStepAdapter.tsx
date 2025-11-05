import React from 'react';
import { UseFormSetValue, FieldPath, FieldPathValue, FieldErrors } from 'react-hook-form';
import { ContactInfoStep } from '@/presentation/components';
import { SuggestionSchema } from '@/domain/ideas/schemas/suggestion.schema';

interface Props {
  setValue: UseFormSetValue<SuggestionSchema>;
  values: Partial<SuggestionSchema>;
  errors: FieldErrors<SuggestionSchema>;
}

export const ContactInfoStepAdapter = ({ setValue, values, errors }: Props) => {
  const onChange = (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (subField) {
      const path = (`${field}.${subField}` as unknown) as FieldPath<SuggestionSchema>;
      setValue(path, value as unknown as FieldPathValue<SuggestionSchema, typeof path>, { shouldValidate: true });
    } else {
      const path = (field as unknown) as FieldPath<SuggestionSchema>;
      setValue(path, value as unknown as FieldPathValue<SuggestionSchema, typeof path>, { shouldValidate: true });
    }
  };

  const onAllowContactChange = (checked: boolean) => {
    const path = ('contactInfo.allowContact' as unknown) as FieldPath<SuggestionSchema>;
    setValue(path, checked as unknown as FieldPathValue<SuggestionSchema, typeof path>, { shouldValidate: true });
  };

  const formData = {
    contactInfo: {
      name: values.contactInfo?.name ?? '',
      email: values.contactInfo?.email ?? '',
      phone: values.contactInfo?.phone ?? '',
      allowContact: values.contactInfo?.allowContact ?? true,
    }
  };

  const flatErrors = {
    name: (errors.contactInfo?.name?.message as string) || '',
    email: (errors.contactInfo?.email?.message as string) || ''
  };

  return <ContactInfoStep formData={formData} errors={flatErrors} onChange={onChange} onAllowContactChange={onAllowContactChange} />;
};

export default ContactInfoStepAdapter;
