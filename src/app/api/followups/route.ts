import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get('timeframe') || 'ALL';

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const endOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);

    const endOf7Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59);

    const where: any = { isCompleted: false };

    if (timeframe === 'OVERDUE') {
      where.scheduledAt = { lt: startOfToday };
    } else if (timeframe === 'TODAY') {
      where.scheduledAt = { gte: startOfToday, lte: endOfToday };
    } else if (timeframe === 'TOMORROW') {
      where.scheduledAt = { gte: startOfTomorrow, lte: endOfTomorrow };
    } else if (timeframe === 'NEXT_7_DAYS') {
      where.scheduledAt = { gte: startOfToday, lte: endOf7Days };
    }

    const followUps = await prisma.followUp.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            category: true,
            city: true,
            phone: true,
            whatsapp: true,
            prospectStatus: true,
            priority: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: followUps });
  } catch (error) {
    console.error('Erro no GET /api/followups:', error);
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, scheduledAt, type, notes } = body;

    if (!leadId || !scheduledAt) {
      return NextResponse.json(
        { error: 'Lead ID e data/hora agendada são obrigatórios.' },
        { status: 400 }
      );
    }

    const followUp = await prisma.followUp.create({
      data: {
        leadId,
        scheduledAt: new Date(scheduledAt),
        type: type || 'WHATSAPP',
        notes: notes || undefined,
      },
    });

    // Atualizar data do próximo contato no lead
    await prisma.savedLead.update({
      where: { id: leadId },
      data: { nextContactAt: new Date(scheduledAt) },
    });

    // Registrar interação no lead
    await prisma.interaction.create({
      data: {
        leadId,
        type: 'NOTE',
        description: `Follow-up agendado para ${new Date(scheduledAt).toLocaleDateString('pt-BR')} via ${type || 'WHATSAPP'}`,
      },
    });

    return NextResponse.json({ success: true, data: followUp });
  } catch (error) {
    console.error('Erro no POST /api/followups:', error);
    return NextResponse.json({ error: 'Falha ao agendar follow-up.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isCompleted } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID do follow-up é obrigatório.' }, { status: 400 });
    }

    const updated = await prisma.followUp.update({
      where: { id },
      data: { isCompleted: isCompleted ?? true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Erro no PATCH /api/followups:', error);
    return NextResponse.json({ error: 'Falha ao atualizar follow-up.' }, { status: 500 });
  }
}
