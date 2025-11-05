import React from 'react';
import { UseFormSetValue, FieldPath, FieldPathValue, FieldErrors } from 'react-hook-form';
import { LocationStep } from '@/presentation/components';
import { SuggestionSchema } from '@/domain/ideas/schemas/suggestion.schema';

interface Props {
  setValue: UseFormSetValue<SuggestionSchema>;
  values: Partial<SuggestionSchema>;
  errors: FieldErrors<SuggestionSchema>;
}

export const LocationStepAdapter = ({ setValue, values, errors }: Props) => {
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

  const formData = {
    location: {
      address: values.location?.address ?? '',
      neighborhood: values.location?.neighborhood ?? '',
      city: values.location?.city ?? 'Votorantim'
    }
  };

  const flatErrors = {
    address: (errors.location?.address?.message as string) || '',
    neighborhood: (errors.location?.neighborhood?.message as string) || ''
  };

  return <LocationStep formData={formData} errors={flatErrors} onChange={onChange} />;
};

export default LocationStepAdapter;

