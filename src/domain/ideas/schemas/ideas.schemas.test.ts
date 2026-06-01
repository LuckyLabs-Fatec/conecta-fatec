import { describe, expect, it } from 'vitest';
import { reviewActionEnum, reviewSchema } from './review.schema';
import { suggestionSchema, suggestionSchemaServer } from './suggestion.schema';

describe('reviewSchema', () => {
  it('exports the available actions', () => {
    expect(reviewActionEnum).toEqual(['approve', 'reject', 'request_info']);
  });

  it.each([
    [{ action: 'approve' }, { action: 'approve' }],
    [{ action: 'approve', message: '  ok  ' }, { action: 'approve', message: 'ok' }],
    [{ action: 'reject', message: '  motivo válido  ' }, { action: 'reject', message: 'motivo válido' }],
    [{ action: 'request_info', message: '  mais detalhes  ' }, { action: 'request_info', message: 'mais detalhes' }],
  ])('accepts valid reviews', (input, output) => {
    expect(reviewSchema.parse(input)).toEqual(output);
  });

  it.each([
    { action: 'unknown' },
    { action: 'reject', message: 'não' },
    { action: 'request_info', message: 'curta' },
    { action: 'approve', message: 'a'.repeat(501) },
  ])('rejects invalid reviews', (review) => {
    expect(reviewSchema.safeParse(review).success).toBe(false);
  });
});

describe('suggestion schemas', () => {
  const contact = {
    primaryEmail: 'principal@fatec.test',
    primaryPhone: '15999999999',
  };

  it('applies contact defaults in browser suggestions', () => {
    expect(suggestionSchema.parse({
      title: 'Título',
      description: 'Descrição',
      attachments: [new File(['content'], 'document.txt')],
      contact,
    }).contact).toEqual({
      ...contact,
      primaryPhoneIsWhatsapp: false,
      secondaryPhoneIsWhatsapp: false,
    });
  });

  it('accepts optional empty browser contact fields', () => {
    expect(suggestionSchema.safeParse({
      title: 'Título',
      description: 'Descrição',
      contact: {
        ...contact,
        secondaryEmail: '',
        secondaryPhone: '',
        details: '',
      },
    }).success).toBe(true);
  });

  it('rejects invalid browser suggestions', () => {
    expect(suggestionSchema.safeParse({
      title: '',
      description: '',
      attachments: Array.from({ length: 6 }, () => new File([], 'file.txt')),
      contact: {
        primaryEmail: 'invalid',
        primaryPhone: 'abc',
        secondaryEmail: 'invalid',
        secondaryPhone: '1',
      },
    }).success).toBe(false);
  });

  it('parses uploaded attachments on the server', () => {
    expect(suggestionSchemaServer.safeParse({
      title: 'Título',
      description: 'Descrição',
      attachments: [{
        key: 'key',
        name: 'document.txt',
        size: 10,
        type: 'text/plain',
        url: 'https://example.test/document.txt',
        uploadedAt: '2026-06-01T00:00:00.000Z',
      }],
      contact,
    }).success).toBe(true);
  });

  it('rejects invalid server suggestions', () => {
    expect(suggestionSchemaServer.safeParse({
      title: '',
      description: '',
      contact: {
        primaryEmail: 'invalid',
        primaryPhone: '123456789012',
        secondaryPhone: 'invalid',
      },
    }).success).toBe(false);
  });
});
