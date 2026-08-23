import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    let allLeads: any[] = [];
    try {
      allLeads = await prisma.savedLead.findMany();
    } catch (dbErr) {
      console.warn('Alerta DB no GET /api/dashboard:', dbErr);
    }

    const metrics = {
      totalFound: allLeads.length,
      novos: allLeads.filter((l) => l.prospectStatus === 'NOVO').length,
      contatados: allLeads.filter((l) =>
        ['CONTATAR', 'CONTATADO', 'RESPONDEU'].includes(l.prospectStatus)
      ).length,
      interessados: allLeads.filter((l) => l.prospectStatus === 'INTERESSADO').length,
      clientes: allLeads.filter((l) => l.prospectStatus === 'CLIENTE').length,
      semInteresse: allLeads.filter((l) => l.prospectStatus === 'SEM_INTERESSE').length,
    };

    const statusChartData = [
      { name: 'Novos', val: metrics.novos, color: '#94a3b8' },
      { name: 'Contatados', val: metrics.contatados, color: '#3b82f6' },
      { name: 'Interessados', val: metrics.interessados, color: '#eab308' },
      { name: 'Clientes', val: metrics.clientes, color: '#22c55e' },
      { name: 'Sem Interesse', val: metrics.semInteresse, color: '#ef4444' },
    ];

    return NextResponse.json({
      success: true,
      metrics,
      statusChartData,
    });
  } catch (error) {
    console.error('Erro no GET /api/dashboard:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar dados do dashboard.' },
      { status: 500 }
    );
  }
}
