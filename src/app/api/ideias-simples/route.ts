import { NextResponse } from 'next/server';
import { suggestionSchemaServer } from '@/domain/ideas/schemas/suggestion.schema';
import {
  createProposal,
  findProposal,
  findUserByEmail,
  listProposals,
  updateProposal,
} from '@/lib/mock/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const data = findProposal(id);

    if (!data) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }
    return NextResponse.json({
      ...data,
      autor: data.usuario?.nome || 'Anônimo'
    });
  }

  const mappedData = listProposals().map((item) => ({
    ...item,
    autor: item.usuario?.nome || 'Anônimo'
  }));

  return NextResponse.json(mappedData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = suggestionSchemaServer.parse(body);

    const { title, description, contact } = validatedData;
    const userData = findUserByEmail(contact.primaryEmail);

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let finalDescription = description;
    if (contact.details && contact.details.trim()) {
      finalDescription += `\n\nInformações de contato:\n${contact.details}`;
    }

    const insertData: any = {
      id_usuario: userData.id_usuario,
      titulo: title,
      descricao: finalDescription,
      status: 'pendente',
      anexos: validatedData.attachments || null,
    };

    if (contact.secondaryEmail && contact.secondaryEmail.trim()) {
      insertData.email_contato_opcional = contact.secondaryEmail;
    }

    if (contact.secondaryPhone && contact.secondaryPhone.trim()) {
      insertData.telefone_contato_opcional = contact.secondaryPhone;
      insertData.telefone_contato_opcional_is_whats = contact.secondaryPhoneIsWhatsapp || false;
    }

    const newIdea = createProposal(insertData);

    return NextResponse.json(newIdea, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Validation or processing error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, mediatorNotes, coordinatorNotes, assignedTo } = body;

    console.log('Update details:', { mediatorNotes, coordinatorNotes, assignedTo });

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const data = updateProposal(id, status ? { status } : {});

    if (!data) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing PUT request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
