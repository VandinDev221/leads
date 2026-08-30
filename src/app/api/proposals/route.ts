import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status) where.status = status;

    const proposals = await prisma.proposal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        lead: {
          select: { id: true, name: true, category: true, city: true, phone: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: proposals });
  } catch (error) {
    console.error('Erro no GET /api/proposals:', error);
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, serviceName, estimatedValue, status, notes, validUntil } = body;

    if (!leadId || !serviceName || !estimatedValue) {
      return NextResponse.json(
        { error: 'Lead ID, nome do serviço e valor estimado são obrigatórios.' },
        { status: 400 }
      );
    }

    const proposal = await prisma.proposal.create({
      data: {
        leadId,
        serviceName,
        estimatedValue: Number(estimatedValue),
        status: status || 'DRAFT',
        notes: notes || undefined,
        validUntil: validUntil ? new Date(validUntil) : undefined,
      },
    });

    // Registrar interação no lead
    await prisma.interaction.create({
      data: {
        leadId,
        type: 'PROPOSAL',
        description: `Proposta comercial criada: ${serviceName} (R$ ${Number(estimatedValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`,
      },
    });

    // Atualizar status do lead para PROPOSTA
    await prisma.savedLead.update({
      where: { id: leadId },
      data: { prospectStatus: 'PROPOSTA' },
    });

    return NextResponse.json({ success: true, data: proposal });
  } catch (error) {
    console.error('Erro no POST /api/proposals:', error);
    return NextResponse.json({ error: 'Falha ao criar proposta.' }, { status: 500 });
  }
}
