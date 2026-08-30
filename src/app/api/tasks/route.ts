import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const leadId = searchParams.get('leadId');

    const where: any = {};
    if (status) where.status = status;
    if (leadId) where.leadId = leadId;

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      include: {
        lead: {
          select: { id: true, name: true, category: true, city: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Erro no GET /api/tasks:', error);
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, leadId, priority, dueDate } = body;

    if (!title) {
      return NextResponse.json({ error: 'Título da tarefa é obrigatório.' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || undefined,
        leadId: leadId || undefined,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    console.error('Erro no POST /api/tasks:', error);
    return NextResponse.json({ error: 'Falha ao criar tarefa.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, title, priority, dueDate } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID da tarefa é obrigatório.' }, { status: 400 });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        status: status || undefined,
        title: title || undefined,
        priority: priority || undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    console.error('Erro no PATCH /api/tasks:', error);
    return NextResponse.json({ error: 'Falha ao atualizar tarefa.' }, { status: 500 });
  }
}
