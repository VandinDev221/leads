import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

const DEFAULT_TEMPLATES = [
  {
    title: 'Primeiro Contato - Criação de Website',
    channel: 'WHATSAPP',
    content:
      'Olá, tudo bem? Vi o perfil da {{empresa}} em {{cidade}} e notei que vocês têm ótimas avaliações! Trabalho com desenvolvimento de websites profissionais e automações. Gostaria de saber se vocês têm interesse em ver um modelo de site moderno para captação de clientes.',
  },
  {
    title: 'Follow-up - Demonstração / Proposta',
    channel: 'WHATSAPP',
    content:
      'Olá! Passando para saber se conseguiu dar uma olhada na proposta que enviei para a {{empresa}}. Posso tirar qualquer dúvida sobre o desenvolvimento!',
  },
  {
    title: 'Automação Comercial & Agendamento',
    channel: 'WHATSAPP',
    content:
      'Olá! Notamos o grande movimento da {{empresa}} em {{cidade}}. Desenvolvemos sistemas de agendamento automático e atendimento via WhatsApp para o segmento de {{categoria}}. Podemos agendar uma conversa rápida de 5 minutos?',
  },
];

export async function GET() {
  try {
    let templates = await prisma.messageTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (templates.length === 0) {
      // Retorna templates padrão se a tabela estiver vazia
      return NextResponse.json({ success: true, data: DEFAULT_TEMPLATES });
    }

    return NextResponse.json({ success: true, data: templates });
  } catch (error) {
    console.error('Erro no GET /api/templates:', error);
    return NextResponse.json({ success: true, data: DEFAULT_TEMPLATES });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, channel, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título e conteúdo do template são obrigatórios.' },
        { status: 400 }
      );
    }

    const template = await prisma.messageTemplate.create({
      data: {
        title,
        channel: channel || 'WHATSAPP',
        content,
      },
    });

    return NextResponse.json({ success: true, data: template });
  } catch (error) {
    console.error('Erro no POST /api/templates:', error);
    return NextResponse.json({ error: 'Falha ao criar template.' }, { status: 500 });
  }
}
