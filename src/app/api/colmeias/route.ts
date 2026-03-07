import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import {
  getColmeiasWithCheckins, upsertColmeia, upsertCheckin, deleteColmeia
} from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const data = await getColmeiasWithCheckins(session.user.id)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { action, colmeia, checkin, colmeiaId } = body
    const userId = session.user.id

    if (action === 'upsert_colmeia') {
      await upsertColmeia(userId, colmeia)
      return NextResponse.json({ ok: true })
    }

    if (action === 'upsert_checkin') {
      await upsertCheckin(colmeiaId, checkin)
      return NextResponse.json({ ok: true })
    }

    if (action === 'delete_colmeia') {
      await deleteColmeia(colmeiaId, userId)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch (err: any) {
    console.error('Colmeias API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
