import { Album, Faixa } from '../types';

// Formato bruto devolvido pela iTunes Search API
export type ItemItunes = {
  wrapperType: string;
  trackId?: number;
  collectionId?: number;
  artistId?: number;
  trackName?: string;
  collectionName?: string;
  artistName?: string;
  artworkUrl100?: string;
  previewUrl?: string;
  trackTimeMillis?: number;
  trackCount?: number;
  releaseDate?: string;
  primaryGenreName?: string;
};

export type RespostaItunes = { resultCount: number; results: ItemItunes[] };

export function redimensionarCapa(url: string | undefined, tamanho: number): string | undefined {
  return url ? url.replace(/\/\d+x\d+bb/, `/${tamanho}x${tamanho}bb`) : undefined;
}

export const ehFaixa = (i: ItemItunes) => i.wrapperType === 'track' && !!i.trackId;
export const ehAlbum = (i: ItemItunes) => i.wrapperType === 'collection' && !!i.collectionId;

export function paraFaixa(i: ItemItunes): Faixa {
  return {
    id: i.trackId ?? 0,
    titulo: i.trackName ?? 'Sem título',
    artista: i.artistName ?? 'Artista desconhecido',
    artistaId: i.artistId,
    album: i.collectionName,
    albumId: i.collectionId,
    capa: redimensionarCapa(i.artworkUrl100, 300),
    previewUrl: i.previewUrl,
    duracaoMs: i.trackTimeMillis,
    genero: i.primaryGenreName,
  };
}

export function paraAlbum(i: ItemItunes): Album {
  return {
    id: i.collectionId ?? 0,
    titulo: i.collectionName ?? 'Sem título',
    artista: i.artistName ?? 'Artista desconhecido',
    artistaId: i.artistId,
    capa: redimensionarCapa(i.artworkUrl100, 300),
    faixas: i.trackCount,
    ano: i.releaseDate?.slice(0, 4),
    genero: i.primaryGenreName,
  };
}
