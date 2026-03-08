import { neon } from '@neondatabase/serverless'

function getDb() {
  return neon(process.env.DATABASE_URL!)
}

async function migrate() {
  const sql = getDb()
  await sql`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL, password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`
  await sql`CREATE TABLE IF NOT EXISTS colmeias (
    id TEXT PRIMARY KEY, user_id TEXT NOT NULL,
    nome TEXT NOT NULL, especie TEXT NOT NULL,
    producao_anual REAL NOT NULL DEFAULT 0, ano_producao INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
  )`
  await sql`CREATE TABLE IF NOT EXISTS checkins (
    id TEXT PRIMARY KEY, colmeia_id TEXT NOT NULL,
    data TEXT NOT NULL, populacao REAL NOT NULL, mansidao REAL NOT NULL,
    sanidade REAL NOT NULL, atividade REAL NOT NULL, notas TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`
}

export async function findUserByEmail(email: string) {
  const sql = getDb()
  await migrate()
  const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`
  return rows[0] || null
}

export async function findUserById(id: string) {
  const sql = getDb()
  const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`
  return rows[0] || null
}

export async function createUser(id: string, email: string, name: string, passwordHash: string) {
  const sql = getDb()
  await sql`INSERT INTO users (id, email, name, password) VALUES (${id}, ${email}, ${name}, ${passwordHash})`
}

export async function getColmeiasWithCheckins(userId: string) {
  const sql = getDb()
  await migrate()
  const colmeias = await sql`SELECT * FROM colmeias WHERE user_id = ${userId} ORDER BY created_at`
  if (!colmeias.length) return []
  const checkins = await sql`
    SELECT * FROM checkins 
    WHERE colmeia_id IN (SELECT id FROM colmeias WHERE user_id = ${userId}) 
    ORDER BY data
  `
  return colmeias.map((c: any) => ({
    id: c.id, nome: c.nome, especie: c.especie,
    producaoAnual: c.producao_anual, anoProducao: c.ano_producao,
    mae: c.mae, nomeMae: c.nome_mae,
    historico: checkins
      .filter((h: any) => h.colmeia_id === c.id)
      .map((h: any) => ({ id: h.id, data: h.data, populacao: h.populacao, mansidao: h.mansidao, sanidade: h.sanidade, atividade: h.atividade, notas: h.notas })),
  }))
}

export async function upsertColmeia(userId: string, col: any) {
  const sql = getDb()
  await sql`INSERT INTO colmeias (id,user_id,nome,especie,producao_anual,ano_producao,mae,nome_mae)
    VALUES (${col.id},${userId},${col.nome},${col.especie},${col.producaoAnual},${col.anoProducao},${col.mae ?? null},${col.nomeMae ?? null})
    ON CONFLICT(id) DO UPDATE SET nome=EXCLUDED.nome, especie=EXCLUDED.especie,
    producao_anual=EXCLUDED.producao_anual, ano_producao=EXCLUDED.ano_producao, mae=EXCLUDED.mae, nome_mae=EXCLUDED.nome_mae, updated_at=NOW()`
}

export async function deleteColmeia(id: string, userId: string) {
  const sql = getDb()
  await sql`DELETE FROM colmeias WHERE id=${id} AND user_id=${userId}`
}

export async function upsertCheckin(colmeiaId: string, h: any) {
  const sql = getDb()
  await sql`INSERT INTO checkins (id,colmeia_id,data,populacao,mansidao,sanidade,atividade,notas)
    VALUES (${h.id},${colmeiaId},${h.data},${h.populacao},${h.mansidao},${h.sanidade},${h.atividade},${h.notas})
    ON CONFLICT(id) DO UPDATE SET data=EXCLUDED.data, populacao=EXCLUDED.populacao,
    mansidao=EXCLUDED.mansidao, sanidade=EXCLUDED.sanidade, atividade=EXCLUDED.atividade, notas=EXCLUDED.notas`
}
