// ─── db.ts ────────────────────────────────────────────────────────────────────
// Suporta dois modos:
//   - DATABASE_URL definida → Neon Postgres (produção)
//   - Sem DATABASE_URL      → SQLite local (desenvolvimento)

let _client: any = null

async function getClient() {
  if (_client) return _client
  if (process.env.DATABASE_URL) {
    const { neon } = await import('@neondatabase/serverless')
    _client = neon(process.env.DATABASE_URL)
    await migrate(_client)
  } else {
    const Database = (await import('better-sqlite3')).default
    const db = new Database('meli.db')
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    migrateSQLite(db)
    _client = { type: 'sqlite', db }
  }
  return _client
}

// ─── Migrations Postgres ──────────────────────────────────────────────────────
async function migrate(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id          TEXT PRIMARY KEY,
      email       TEXT UNIQUE NOT NULL,
      name        TEXT NOT NULL,
      password    TEXT NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS colmeias (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      nome            TEXT NOT NULL,
      especie         TEXT NOT NULL,
      producao_anual  REAL NOT NULL DEFAULT 0,
      ano_producao    INTEGER NOT NULL,
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      updated_at      TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS checkins (
      id          TEXT PRIMARY KEY,
      colmeia_id  TEXT NOT NULL REFERENCES colmeias(id) ON DELETE CASCADE,
      data        TEXT NOT NULL,
      populacao   REAL NOT NULL,
      mansidao    REAL NOT NULL,
      sanidade    REAL NOT NULL,
      atividade   REAL NOT NULL,
      notas       TEXT DEFAULT '',
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_colmeias_user ON colmeias(user_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_checkins_colmeia ON checkins(colmeia_id)`
}

// ─── Migrations SQLite ────────────────────────────────────────────────────────
function migrateSQLite(db: any) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL, password TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS colmeias (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      nome TEXT NOT NULL, especie TEXT NOT NULL,
      producao_anual REAL NOT NULL DEFAULT 0, ano_producao INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS checkins (
      id TEXT PRIMARY KEY, colmeia_id TEXT NOT NULL REFERENCES colmeias(id) ON DELETE CASCADE,
      data TEXT NOT NULL, populacao REAL NOT NULL, mansidao REAL NOT NULL,
      sanidade REAL NOT NULL, atividade REAL NOT NULL, notas TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_colmeias_user ON colmeias(user_id);
    CREATE INDEX IF NOT EXISTS idx_checkins_colmeia ON checkins(colmeia_id);
  `)
}

// ─── Helpers universais ───────────────────────────────────────────────────────
export async function findUserByEmail(email: string) {
  const c = await getClient()
  if (c.type === 'sqlite') {
    return c.db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  }
  const rows = await c`SELECT * FROM users WHERE email = ${email} LIMIT 1`
  return rows[0] || null
}

export async function findUserById(id: string) {
  const c = await getClient()
  if (c.type === 'sqlite') {
    return c.db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  }
  const rows = await c`SELECT * FROM users WHERE id = ${id} LIMIT 1`
  return rows[0] || null
}

export async function createUser(id: string, email: string, name: string, passwordHash: string) {
  const c = await getClient()
  if (c.type === 'sqlite') {
    c.db.prepare('INSERT INTO users (id, email, name, password) VALUES (?, ?, ?, ?)').run(id, email, name, passwordHash)
    return
  }
  await c`INSERT INTO users (id, email, name, password) VALUES (${id}, ${email}, ${name}, ${passwordHash})`
}

export async function getColmeiasWithCheckins(userId: string) {
  const c = await getClient()
  let colmeias: any[], checkinRows: any[]

  if (c.type === 'sqlite') {
    colmeias = c.db.prepare('SELECT * FROM colmeias WHERE user_id = ? ORDER BY created_at').all(userId)
    checkinRows = colmeias.length
      ? c.db.prepare(`SELECT * FROM checkins WHERE colmeia_id IN (${colmeias.map(() => '?').join(',')}) ORDER BY data`)
          .all(...colmeias.map((x: any) => x.id))
      : []
  } else {
    colmeias = await c`SELECT * FROM colmeias WHERE user_id = ${userId} ORDER BY created_at`
    checkinRows = colmeias.length
      ? await c`SELECT * FROM checkins WHERE colmeia_id = ANY(${colmeias.map((x: any) => x.id)}) ORDER BY data`
      : []
  }

  return colmeias.map((col: any) => ({
    id: col.id, nome: col.nome, especie: col.especie,
    producaoAnual: col.producao_anual, anoProducao: col.ano_producao,
    historico: checkinRows
      .filter((h: any) => h.colmeia_id === col.id)
      .map((h: any) => ({ id: h.id, data: h.data, populacao: h.populacao, mansidao: h.mansidao, sanidade: h.sanidade, atividade: h.atividade, notas: h.notas })),
  }))
}

export async function upsertColmeia(userId: string, col: any) {
  const c = await getClient()
  if (c.type === 'sqlite') {
    c.db.prepare(`INSERT INTO colmeias (id,user_id,nome,especie,producao_anual,ano_producao,updated_at)
      VALUES (?,?,?,?,?,?,datetime('now'))
      ON CONFLICT(id) DO UPDATE SET nome=excluded.nome,especie=excluded.especie,
      producao_anual=excluded.producao_anual,ano_producao=excluded.ano_producao,updated_at=datetime('now')`)
      .run(col.id, userId, col.nome, col.especie, col.producaoAnual, col.anoProducao)
    return
  }
  await c`INSERT INTO colmeias (id,user_id,nome,especie,producao_anual,ano_producao)
    VALUES (${col.id},${userId},${col.nome},${col.especie},${col.producaoAnual},${col.anoProducao})
    ON CONFLICT(id) DO UPDATE SET nome=EXCLUDED.nome,especie=EXCLUDED.especie,
    producao_anual=EXCLUDED.producao_anual,ano_producao=EXCLUDED.ano_producao,updated_at=NOW()`
}

export async function deleteColmeia(id: string, userId: string) {
  const c = await getClient()
  if (c.type === 'sqlite') {
    c.db.prepare('DELETE FROM colmeias WHERE id=? AND user_id=?').run(id, userId)
    return
  }
  await c`DELETE FROM colmeias WHERE id=${id} AND user_id=${userId}`
}

export async function upsertCheckin(colmeiaId: string, h: any) {
  const c = await getClient()
  if (c.type === 'sqlite') {
    c.db.prepare(`INSERT INTO checkins (id,colmeia_id,data,populacao,mansidao,sanidade,atividade,notas)
      VALUES (?,?,?,?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET data=excluded.data,populacao=excluded.populacao,
      mansidao=excluded.mansidao,sanidade=excluded.sanidade,atividade=excluded.atividade,notas=excluded.notas`)
      .run(h.id, colmeiaId, h.data, h.populacao, h.mansidao, h.sanidade, h.atividade, h.notas)
    return
  }
  await c`INSERT INTO checkins (id,colmeia_id,data,populacao,mansidao,sanidade,atividade,notas)
    VALUES (${h.id},${colmeiaId},${h.data},${h.populacao},${h.mansidao},${h.sanidade},${h.atividade},${h.notas})
    ON CONFLICT(id) DO UPDATE SET data=EXCLUDED.data,populacao=EXCLUDED.populacao,
    mansidao=EXCLUDED.mansidao,sanidade=EXCLUDED.sanidade,atividade=EXCLUDED.atividade,notas=EXCLUDED.notas`
}
