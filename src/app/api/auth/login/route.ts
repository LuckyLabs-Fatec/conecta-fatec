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

    const mapAppRoleToApiRole = (appRole: string) => {
        const map: Record<string, string> = {
            'comunidade': 'SOCIETY',
            'mediador': 'MEDIATOR',
            'coordenador': 'COORDINATOR',
            'estudante': 'STUDENT',
            'admin': 'ADMIN',
        };

        return map[appRole] ?? 'SOCIETY';
    };

    return NextResponse.json(
        {
            accessToken: crypto.randomUUID(),
            user: {
                id: user.uid,
                email: user.email,
                name: user.nome,
                avatar: user.user_metadata?.avatar ?? null,
                phone: user.telefone ?? '',
                phoneIsWhats: user.telefone_is_whats ?? false,
                role: mapAppRoleToApiRole(user.perfil),
            },
        },
        { status: 200 }
    );
}
