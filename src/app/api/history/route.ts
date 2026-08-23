import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    let history: any[] = [];
    try {
      history = await prisma.searchHistory.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    } catch (dbErr) {
      console.warn('Alerta DB no GET /api/history:', dbErr);
    }

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error('Erro ao buscar histórico de pesquisas:', error);
    return NextResponse.json({ success: true, data: [] });
  }
}
