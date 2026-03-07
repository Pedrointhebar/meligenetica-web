import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createUser, findUserByEmail } from '@/lib/db'
import { sendWelcomeEmail } from '@/lib/email'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, name, password } = await req.json()
    if (!email || !name || !password)
      return NextResponse.json({ error: 'Preencha todos os campos.' }, { status: 400 })
    if (password.length < 6)
      return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres.' }, { status: 400 })
    const emailClean = email.toLowerCase().trim()
    if (await findUserByEmail(emailClean))
      return NextResponse.json({ error: 'Este e-mail já está cadastrado.' }, { status: 409 })
    const hash = await bcrypt.hash(password, 12)
    await createUser(randomUUID(), emailClean, name.trim(), hash)
    // Envia e-mail de boas-vindas (não bloqueia o cadastro se falhar)
    sendWelcomeEmail(emailClean, name.trim()).catch(console.error)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
