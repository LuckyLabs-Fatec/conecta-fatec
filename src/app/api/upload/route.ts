import { NextRequest, NextResponse } from 'next/server';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'Nenhum arquivo fornecido' }, { status: 400 });
    }

    if (files.length > 5) {
      return NextResponse.json({ error: 'Máximo de 5 arquivos permitidos' }, { status: 400 });
    }

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Arquivo ${file.name} excede o tamanho máximo de 10MB` },
          { status: 400 }
        );
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Tipo de arquivo ${file.type} não permitido` },
          { status: 400 }
        );
      }
    }

    const uploadedFiles = [];
    const timestamp = Date.now();
    const userId = req.headers.get('x-mock-user-id') || 'mock-user';

    for (const file of files) {
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}-${sanitizedFileName}`;
      const filePath = `propostas/${userId}/${fileName}`;

      uploadedFiles.push({
        key: filePath,
        name: file.name,
        size: file.size,
        type: file.type,
        url: `/mock-upload/${encodeURIComponent(fileName)}`,
        uploadedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ files: uploadedFiles }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
