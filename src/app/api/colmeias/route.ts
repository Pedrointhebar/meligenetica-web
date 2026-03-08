import { NextRequest, NextResponse } from 'next/server'
// import { auth } from '@clerk/nextjs/server'
import {
  getColmeiasWithCheckins, upsertColmeia, upsertCheckin, deleteColmeia
} from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  // const { userId } = auth()
  // if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const userId = 'temp-user-id' // Temporário
  const data = await getColmeiasWithCheckins(userId)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  // const { userId } = auth()
  // if (!userId)
  //   return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const userId = 'temp-user-id' // Temporário

  try {
    const body = await req.json()
    const { action, colmeia, checkin, colmeiaId } = body

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
