import * as SQLite from 'expo-sqlite';
import { Faixa, PlaylistLocal } from '../types';

type Linha = {
  trackId: number;
  titulo: string;
  artista: string;
  artistaId: number | null;
  album: string | null;
  albumId: number | null;
  capa: string | null;
  previewUrl: string | null;
  duracaoMs: number | null;
};

const COLUNAS = 'trackId, titulo, artista, artistaId, album, albumId, capa, previewUrl, duracaoMs';
const INTERROGACOES = '?, ?, ?, ?, ?, ?, ?, ?, ?';

let aberto: Promise<SQLite.SQLiteDatabase> | null = null;

async function abrir(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync('telasytmusic.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS curtidas (
      trackId INTEGER PRIMARY KEY NOT NULL,
      titulo TEXT NOT NULL, artista TEXT NOT NULL, artistaId INTEGER,
      album TEXT, albumId INTEGER, capa TEXT, previewUrl TEXT, duracaoMs INTEGER,
      curtidoEm INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS playlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      criadaEm INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS playlist_faixas (
      playlistId INTEGER NOT NULL,
      trackId INTEGER NOT NULL,
      titulo TEXT NOT NULL, artista TEXT NOT NULL, artistaId INTEGER,
      album TEXT, albumId INTEGER, capa TEXT, previewUrl TEXT, duracaoMs INTEGER,
      adicionadaEm INTEGER NOT NULL,
      PRIMARY KEY (playlistId, trackId)
    );
    CREATE TABLE IF NOT EXISTS historico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trackId INTEGER NOT NULL,
      titulo TEXT NOT NULL, artista TEXT NOT NULL, artistaId INTEGER,
      album TEXT, albumId INTEGER, capa TEXT, previewUrl TEXT, duracaoMs INTEGER,
      tocadoEm INTEGER NOT NULL
    );
  `);
  return db;
}

// Abre o banco e cria as tabelas uma unica vez (singleton).
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!aberto) aberto = abrir();
  return aberto;
}

const paraLinha = (f: Faixa): (string | number | null)[] => [
  f.id,
  f.titulo,
  f.artista,
  f.artistaId ?? null,
  f.album ?? null,
  f.albumId ?? null,
  f.capa ?? null,
  f.previewUrl ?? null,
  f.duracaoMs ?? null,
];

const paraFaixa = (l: Linha): Faixa => ({
  id: l.trackId,
  titulo: l.titulo,
  artista: l.artista,
  artistaId: l.artistaId ?? undefined,
  album: l.album ?? undefined,
  albumId: l.albumId ?? undefined,
  capa: l.capa ?? undefined,
  previewUrl: l.previewUrl ?? undefined,
  duracaoMs: l.duracaoMs ?? undefined,
});

// ---------- Curtidas ----------
export async function curtir(f: Faixa): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO curtidas (${COLUNAS}, curtidoEm) VALUES (${INTERROGACOES}, ?)`,
    [...paraLinha(f), Date.now()],
  );
}

export async function descurtir(trackId: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM curtidas WHERE trackId = ?', [trackId]);
}

export async function listarCurtidas(): Promise<Faixa[]> {
  const db = await getDb();
  const linhas = await db.getAllAsync<Linha>(`SELECT ${COLUNAS} FROM curtidas ORDER BY curtidoEm DESC`);
  return linhas.map(paraFaixa);
}

export async function idsCurtidos(): Promise<number[]> {
  const db = await getDb();
  const linhas = await db.getAllAsync<{ trackId: number }>('SELECT trackId FROM curtidas');
  return linhas.map((l) => l.trackId);
}

// ---------- Playlists ----------
export async function criarPlaylist(nome: string): Promise<number> {
  const db = await getDb();
  const r = await db.runAsync('INSERT INTO playlists (nome, criadaEm) VALUES (?, ?)', [nome.trim(), Date.now()]);
  return r.lastInsertRowId;
}

export async function listarPlaylists(): Promise<PlaylistLocal[]> {
  const db = await getDb();
  return db.getAllAsync<PlaylistLocal>(
    `SELECT p.id, p.nome, p.criadaEm,
            (SELECT COUNT(*) FROM playlist_faixas f WHERE f.playlistId = p.id) AS total
       FROM playlists p ORDER BY p.id DESC`,
  );
}

export async function buscarPlaylist(id: number): Promise<PlaylistLocal | null> {
  const db = await getDb();
  return db.getFirstAsync<PlaylistLocal>(
    `SELECT p.id, p.nome, p.criadaEm,
            (SELECT COUNT(*) FROM playlist_faixas f WHERE f.playlistId = p.id) AS total
       FROM playlists p WHERE p.id = ?`,
    [id],
  );
}

export async function excluirPlaylist(id: number): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM playlist_faixas WHERE playlistId = ?', [id]);
    await db.runAsync('DELETE FROM playlists WHERE id = ?', [id]);
  });
}

// Devolve false quando a faixa ja estava na playlist.
export async function adicionarNaPlaylist(playlistId: number, f: Faixa): Promise<boolean> {
  const db = await getDb();
  const r = await db.runAsync(
    `INSERT OR IGNORE INTO playlist_faixas (playlistId, ${COLUNAS}, adicionadaEm) VALUES (?, ${INTERROGACOES}, ?)`,
    [playlistId, ...paraLinha(f), Date.now()],
  );
  return r.changes > 0;
}

export async function listarFaixasDaPlaylist(playlistId: number): Promise<Faixa[]> {
  const db = await getDb();
  const linhas = await db.getAllAsync<Linha>(
    `SELECT ${COLUNAS} FROM playlist_faixas WHERE playlistId = ? ORDER BY adicionadaEm ASC`,
    [playlistId],
  );
  return linhas.map(paraFaixa);
}

export async function removerDaPlaylist(playlistId: number, trackId: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM playlist_faixas WHERE playlistId = ? AND trackId = ?', [playlistId, trackId]);
}

// ---------- Historico de reproducao ----------
export async function registrarHistorico(f: Faixa): Promise<void> {
  const db = await getDb();
  await db.runAsync(`INSERT INTO historico (${COLUNAS}, tocadoEm) VALUES (${INTERROGACOES}, ?)`, [
    ...paraLinha(f),
    Date.now(),
  ]);
}

export async function listarHistorico(limite = 50): Promise<Faixa[]> {
  const db = await getDb();
  const linhas = await db.getAllAsync<Linha>(`SELECT ${COLUNAS} FROM historico ORDER BY id DESC LIMIT ?`, [limite]);
  return linhas.map(paraFaixa);
}

// "Ouca de novo": ultima vez de cada faixa, sem repetir
export async function listarOuvidasRecentes(limite = 10): Promise<Faixa[]> {
  const db = await getDb();
  const linhas = await db.getAllAsync<Linha>(
    `SELECT ${COLUNAS} FROM historico
      WHERE id IN (SELECT MAX(id) FROM historico GROUP BY trackId)
      ORDER BY id DESC LIMIT ?`,
    [limite],
  );
  return linhas.map(paraFaixa);
}

export async function limparHistorico(): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM historico');
}
