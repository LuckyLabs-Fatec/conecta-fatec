import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SuggestionSchema } from '@/domain/ideas/schemas/suggestion.schema';
import http from '@/presentation/lib/http';

type UploadFileItem = {
  key: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
};

type CreateProposalVariables = {
  data: SuggestionSchema;
  authorEmail: string;
};

const uploadAttachments = async (files: File[]): Promise<UploadFileItem[]> => {
  if (files.length === 0) {
    return [];
  }

  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await http.post('/api/upload', formData);
  return response.data.files as UploadFileItem[];
};

export const useCreateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, authorEmail }: CreateProposalVariables) => {
      const uploadedFiles = data.attachments ? await uploadAttachments(data.attachments) : [];

      const response = await http.post('/proposals', {
        title: data.title,
        description: data.description,
        submissionDate: new Date().toISOString(),
        status: 'SUBMITTED',
        attachments: uploadedFiles.length > 0 ? JSON.stringify(uploadedFiles) : '',
        optionalContactPhone: data.contact.primaryPhone,
        optionalContactPhoneIsWhats: data.contact.primaryPhoneIsWhatsapp,
        optionalContactEmail: data.contact.secondaryEmail || '',
        authorEmail,
      });

      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['my-proposals', variables.authorEmail] });
      queryClient.invalidateQueries({ queryKey: ['my-proposals'] });
    },
  });
};
