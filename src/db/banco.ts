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
