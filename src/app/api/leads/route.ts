import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const favoriteOnly = searchParams.get('favorite') === 'true';
    const status = searchParams.get('status');
    const query = searchParams.get('q');

    const where: any = {};

    if (favoriteOnly) {
      where.isFavorite = true;
    }

    if (status) {
      where.prospectStatus = status;
    }

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { category: { contains: query } },
        { city: { contains: query } },
        { address: { contains: query } },
      ];
    }

    const leads = await prisma.savedLead.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    console.warn('DB inacessível ou não inicializado no GET /api/leads. Retornando fallback limpo:', error);
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      externalId,
      name,
      category,
      address,
      city,
      state,
      latitude,
      longitude,
      phone,
      website,
      whatsapp,
      instagram,
      rating,
      reviewCount,
      mapsUrl,
      source,
      prospectStatus,
      notes,
      lastContactedAt,
      nextContactAt,
      isFavorite,
    } = body;

    if (!externalId || !name) {
      return NextResponse.json(
        { error: 'ID externo e nome da empresa são obrigatórios.' },
        { status: 400 }
      );
    }

    let saved = null;
    try {
      saved = await prisma.savedLead.upsert({
        where: { externalId },
        update: {
          prospectStatus: prospectStatus || undefined,
          notes: notes !== undefined ? notes : undefined,
          lastContactedAt: lastContactedAt ? new Date(lastContactedAt) : undefined,
          nextContactAt: nextContactAt ? new Date(nextContactAt) : undefined,
          isFavorite: isFavorite !== undefined ? isFavorite : undefined,
          phone: phone || undefined,
          website: website || undefined,
          whatsapp: whatsapp || undefined,
          instagram: instagram || undefined,
          rating: rating !== undefined ? Number(rating) : undefined,
          reviewCount: reviewCount !== undefined ? Number(reviewCount) : undefined,
        },
        create: {
          externalId,
          name,
          category: category || 'Geral',
          address: address || 'Não informado',
          city: city || 'Não informado',
          state: state || undefined,
          latitude: Number(latitude) || 0,
          longitude: Number(longitude) || 0,
          phone: phone || undefined,
          website: website || undefined,
          whatsapp: whatsapp || undefined,
          instagram: instagram || undefined,
          rating: rating !== undefined ? Number(rating) : undefined,
          reviewCount: reviewCount !== undefined ? Number(reviewCount) : undefined,
          mapsUrl: mapsUrl || `https://maps.google.com/?q=${latitude},${longitude}`,
          source: source || 'nominatim',
          prospectStatus: prospectStatus || 'NOVO',
          notes: notes || undefined,
          lastContactedAt: lastContactedAt ? new Date(lastContactedAt) : undefined,
          nextContactAt: nextContactAt ? new Date(nextContactAt) : undefined,
          isFavorite: isFavorite ?? false,
        },
      });
    } catch (dbErr) {
      console.warn('Persistência DB indisponível:', dbErr);
    }

    return NextResponse.json({
      success: true,
      data: saved || {
        externalId,
        name,
        prospectStatus: prospectStatus || 'NOVO',
        isFavorite: isFavorite ?? false,
      },
    });
  } catch (error) {
    console.error('Erro no POST /api/leads:', error);
    return NextResponse.json(
      { error: 'Falha ao salvar/atualizar lead.' },
      { status: 500 }
    );
  }
}
