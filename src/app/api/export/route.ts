import { NextRequest, NextResponse } from 'next/server';
import { generateBusinessesCSV } from '@/lib/export/csv-exporter';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let businesses = body.businesses;

    // Se não passou a lista no body, busca todos os leads salvos no banco
    if (!businesses || !Array.isArray(businesses) || businesses.length === 0) {
      businesses = await prisma.savedLead.findMany({
        orderBy: { updatedAt: 'desc' },
      });
    }

    const csvContent = generateBusinessesCSV(businesses);

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="leadfinder_export_${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error('Erro na exportação para CSV:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar arquivo CSV.' },
      { status: 500 }
    );
  }
}
