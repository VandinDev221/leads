import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contacts = await prisma.leadContact.findMany({
      where: { leadId: params.id },
      orderBy: { isPrimary: 'desc' },
    });
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Erro no GET /api/leads/[id]/contacts:', error);
    return NextResponse.json({ error: 'Falha ao buscar contatos do lead.' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, role, phone, email, whatsapp, instagram, notes, isPrimary } = body;

    if (!name) {
      return NextResponse.json({ error: 'Nome do contato é obrigatório.' }, { status: 400 });
    }

    // Se o contato for marcado como principal, remove o status de principal dos demais
    if (isPrimary) {
      await prisma.leadContact.updateMany({
        where: { leadId: params.id },
        data: { isPrimary: false },
      });
    }

    const contact = await prisma.leadContact.create({
      data: {
        leadId: params.id,
        name,
        role: role || undefined,
        phone: phone || undefined,
        email: email || undefined,
        whatsapp: whatsapp || undefined,
        instagram: instagram || undefined,
        notes: notes || undefined,
        isPrimary: isPrimary ?? false,
      },
    });

    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error('Erro no POST /api/leads/[id]/contacts:', error);
    return NextResponse.json({ error: 'Falha ao adicionar contato.' }, { status: 500 });
  }
}
