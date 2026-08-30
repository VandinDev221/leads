import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { calculateLeadScore } from '@/lib/scoring/lead-score';
import { analyzeLeadOpportunities } from '@/lib/opportunity/opportunity-analyzer';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const favoriteOnly = searchParams.get('favorite') === 'true';
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const query = searchParams.get('q');

    const where: any = {};

    if (favoriteOnly) {
      where.isFavorite = true;
    }

    if (status) {
      where.prospectStatus = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
      ];
    }

    const leads = await prisma.savedLead.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        contacts: true,
        interactions: { take: 5, orderBy: { createdAt: 'desc' } },
        followUps: { where: { isCompleted: false }, orderBy: { scheduledAt: 'asc' } },
      },
    });

    const enrichedLeads = leads.map((lead) => {
      const scoreInfo = calculateLeadScore(lead as any);
      const opportunities = analyzeLeadOpportunities(lead as any);
      return {
        ...lead,
        isSaved: true,
        scoreInfo,
        opportunities,
      };
    });

    return NextResponse.json({ success: true, data: enrichedLeads });
  } catch (error) {
    console.warn('DB no GET /api/leads:', error);
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
      email,
      website,
      whatsapp,
      instagram,
      facebook,
      rating,
      reviewCount,
      mapsUrl,
      source,
      prospectStatus,
      priority,
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

    const scoreInfo = calculateLeadScore(body);

    let saved = null;
    try {
      saved = await prisma.savedLead.upsert({
        where: { externalId },
        update: {
          prospectStatus: prospectStatus || undefined,
          priority: priority || undefined,
          notes: notes !== undefined ? notes : undefined,
          lastContactedAt: lastContactedAt ? new Date(lastContactedAt) : undefined,
          nextContactAt: nextContactAt ? new Date(nextContactAt) : undefined,
          isFavorite: isFavorite !== undefined ? isFavorite : undefined,
          phone: phone || undefined,
          email: email || undefined,
          website: website || undefined,
          whatsapp: whatsapp || undefined,
          instagram: instagram || undefined,
          facebook: facebook || undefined,
          rating: rating !== undefined ? Number(rating) : undefined,
          reviewCount: reviewCount !== undefined ? Number(reviewCount) : undefined,
          leadScore: scoreInfo.totalScore,
          opportunityScore: scoreInfo.opportunityScore,
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
          email: email || undefined,
          website: website || undefined,
          whatsapp: whatsapp || undefined,
          instagram: instagram || undefined,
          facebook: facebook || undefined,
          rating: rating !== undefined ? Number(rating) : undefined,
          reviewCount: reviewCount !== undefined ? Number(reviewCount) : undefined,
          mapsUrl: mapsUrl || `https://maps.google.com/?q=${latitude},${longitude}`,
          source: source || 'nominatim',
          prospectStatus: prospectStatus || 'NOVO',
          priority: priority || 'MEDIUM',
          notes: notes || undefined,
          lastContactedAt: lastContactedAt ? new Date(lastContactedAt) : undefined,
          nextContactAt: nextContactAt ? new Date(nextContactAt) : undefined,
          isFavorite: isFavorite ?? false,
          leadScore: scoreInfo.totalScore,
          opportunityScore: scoreInfo.opportunityScore,
        },
      });

      // Se foi um salvamento de novo lead, gravar interação inicial na timeline
      await prisma.interaction.create({
        data: {
          leadId: saved.id,
          type: 'NOTE',
          description: `Lead adicionado à carteira (Score: ${scoreInfo.totalScore})`,
        },
      });
    } catch (dbErr) {
      console.warn('Alerta de salvamento em /api/leads:', dbErr);
    }

    return NextResponse.json({
      success: true,
      data: saved || {
        externalId,
        name,
        prospectStatus: prospectStatus || 'NOVO',
        isFavorite: isFavorite ?? false,
        scoreInfo,
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
