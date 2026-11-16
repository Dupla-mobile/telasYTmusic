# TelasYTmusic

Clone funcional do **YouTube Music** em **React Native + Expo (SDK 58)**, feito para o P2 de Aplicativos Híbridos.

## Como rodar

Requer **Node.js 22.13 ou superior** (exigência do SDK 58).

```bash
npm install
npx expo start
```

Escaneie o QR code com o **Expo Go** (versão do SDK 58). Login simulado: qualquer e-mail válido e senha com 4+ caracteres.

## O que o app faz

- Toca prévias de 30 s de músicas reais (iTunes Search API, sem chave) com fila, aleatório, repetir e mini-player.
- Busca músicas/álbuns, navega por gênero, abre álbuns e artistas.
- Curtidas, playlists próprias e histórico guardados no aparelho.

## Telas (15) — navegação com Expo Router

| Rota | Tela |
|---|---|
| `/login` | Login |
| `/(tabs)` | Início, Explorar, Biblioteca, Perfil |
| `/busca` | Busca (músicas/álbuns) |
| `/album/[id]` | Detalhe do álbum |
| `/artista/[id]` | Detalhe do artista |
| `/player` | Player (modal) |
| `/curtidas` | Músicas curtidas |
| `/playlist/[id]` | Detalhe da playlist |
| `/playlist/nova` | Nova playlist |
| `/historico` | Histórico de reprodução |
| `/configuracoes` | Configurações |
| `/feedback` | Enviar feedback (POST) |

## Estrutura

```
app/        rotas (Expo Router)
src/
  components/  context/  db/  hooks/  services/  constants/  utils/  types.ts
```
