import { NextRequest, NextResponse } from 'next/server';
import { ProviderFactory } from '@/lib/providers/provider.factory';
import { prisma } from '@/lib/db/prisma';
import { SearchBusinessesParams } from '@/types/business';

export async function POST(req: NextRequest) {
  try {
    const body: SearchBusinessesParams = await req.json();
    const { category, location, radiusKm, filters, provider } = body;

    if (!category || !location) {
      return NextResponse.json(
        { error: 'Categoria e localização são obrigatórios.' },
        { status: 400 }
      );
    }

    // 1. Executar a busca pelo ProviderFactory
    const rawBusinesses = await ProviderFactory.search({
      category,
      location,
      radiusKm: Number(radiusKm) || 10,
      filters,
      provider,
    });

    // 2. Buscar leads já salvos no banco para mesclar status, favoritos e observações
    const externalIds = rawBusinesses.map((b) => b.externalId);
    let savedLeads: any[] = [];
    try {
      savedLeads = await prisma.savedLead.findMany({
        where: { externalId: { in: externalIds } },
      });
    } catch (e) {
      console.warn('Alerta Prisma: Tabela SavedLead ainda não inicializada no DB local.', e);
    }

    const savedMap = new Map(savedLeads.map((s) => [s.externalId, s]));

    const mergedBusinesses = rawBusinesses.map((b) => {
      const saved = savedMap.get(b.externalId);
      if (saved) {
        return {
          ...b,
          id: saved.id,
          prospectStatus: saved.prospectStatus as any,
          notes: saved.notes || undefined,
          lastContactedAt: saved.lastContactedAt || undefined,
          nextContactAt: saved.nextContactAt || undefined,
          isFavorite: saved.isFavorite,
          isSaved: true,
        };
      }
      return {
        ...b,
        prospectStatus: 'NOVO' as const,
        isFavorite: false,
        isSaved: false,
      };
    });

    // 3. Salvar no histórico de buscas
    try {
      await prisma.searchHistory.create({
        data: {
          category,
          location,
          radiusKm: Number(radiusKm) || 10,
          resultsCount: mergedBusinesses.length,
        },
      });
    } catch (e) {
      console.warn('Alerta Prisma: Falha ao gravar SearchHistory', e);
    }

    return NextResponse.json({
      success: true,
      total: mergedBusinesses.length,
      data: mergedBusinesses,
    });
  } catch (error: any) {
    console.error('Erro na API /api/search:', error);
    return NextResponse.json(
      { error: 'Não foi possível realizar a busca. Tente novamente.' },
      { status: 500 }
    );
  }
}
