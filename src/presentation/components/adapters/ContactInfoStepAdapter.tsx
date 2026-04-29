import React from 'react';
import { UseFormSetValue, FieldPath, FieldPathValue, FieldErrors } from 'react-hook-form';
import { ContactInfoStep } from '@/presentation/components';
import { SuggestionSchema } from '@/domain/ideas/schemas/suggestion.schema';

interface Props {
  setValue: UseFormSetValue<SuggestionSchema>;
  values: Partial<SuggestionSchema>;
  errors: FieldErrors<SuggestionSchema>;
  hasPhone?: boolean;
}

export const ContactInfoStepAdapter = ({ setValue, values, errors, hasPhone = false }: Props) => {
  const onChange = (field: string, subField?: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = (e.target as HTMLInputElement).value;
    if (subField) {
      const path = (`${field}.${subField}` as unknown) as FieldPath<SuggestionSchema>;
      setValue(path, value as unknown as FieldPathValue<SuggestionSchema, typeof path>, { shouldValidate: true });
    } else {
      const path = (field as unknown) as FieldPath<SuggestionSchema>;
      setValue(path, value as unknown as FieldPathValue<SuggestionSchema, typeof path>, { shouldValidate: true });
    }
  };

  const onToggle = (subField: string, checked: boolean) => {
    const path = (`contact.${subField}` as unknown) as FieldPath<SuggestionSchema>;
    setValue(path, checked as unknown as FieldPathValue<SuggestionSchema, typeof path>, { shouldValidate: true });
  };

  const formData = {
    contact: {
      primaryEmail: values.contact?.primaryEmail ?? '',
      secondaryEmail: values.contact?.secondaryEmail ?? '',
      primaryPhone: values.contact?.primaryPhone ?? '',
      secondaryPhone: values.contact?.secondaryPhone ?? '',
      details: values.contact?.details ?? '',
      primaryPhoneIsWhatsapp: values.contact?.primaryPhoneIsWhatsapp ?? false,
      secondaryPhoneIsWhatsapp: values.contact?.secondaryPhoneIsWhatsapp ?? false,
    }
  };

  const flatErrors = {
    primaryEmail: (errors.contact?.primaryEmail?.message as string) || '',
    secondaryEmail: (errors.contact?.secondaryEmail?.message as string) || '',
    primaryPhone: (errors.contact?.primaryPhone?.message as string) || '',
  } as { [key: string]: string };

  return <ContactInfoStep formData={formData} errors={flatErrors} onChange={onChange} onToggle={onToggle} hasPhone={hasPhone} />;
};

export default ContactInfoStepAdapter;
