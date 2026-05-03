import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { findUserByEmail } from '@/lib/mock/db';

const loginSchema = z.object({
    email: z.string().min(1).email(),
    password: z.string().min(1),
});

export async function POST(req: NextRequest) {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(
            { error: 'Email e senha são obrigatórios' },
            { status: 400 }
        );
    }

    const { email } = validation.data;
    const user = findUserByEmail(email);

    if (!user) {
        return NextResponse.json(
            { error: 'Email ou senha inválidos' },
            { status: 401 }
        );
    }

    return NextResponse.json(
        {
            accessToken: crypto.randomUUID(),
            role: user.perfil,
        },
        { status: 200 }
    );
}
