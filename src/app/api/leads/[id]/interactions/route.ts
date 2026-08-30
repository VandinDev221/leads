import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const interactions = await prisma.interaction.findMany({
      where: { leadId: params.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: interactions });
  } catch (error) {
    console.error('Erro no GET /api/leads/[id]/interactions:', error);
    return NextResponse.json({ error: 'Falha ao buscar interações.' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { type, description } = body;

    if (!type || !description) {
      return NextResponse.json(
        { error: 'Tipo e descrição da interação são obrigatórios.' },
        { status: 400 }
      );
    }

    const interaction = await prisma.interaction.create({
      data: {
        leadId: params.id,
        type: type,
        description,
      },
    });

    // Atualizar data do último contato no lead
    await prisma.savedLead.update({
      where: { id: params.id },
      data: { lastContactedAt: new Date() },
    });

    return NextResponse.json({ success: true, data: interaction });
  } catch (error) {
    console.error('Erro no POST /api/leads/[id]/interactions:', error);
    return NextResponse.json({ error: 'Falha ao registrar interação.' }, { status: 500 });
  }
}
