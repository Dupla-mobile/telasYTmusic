# YT Music Clone

Projeto de faculdade: clone (mocagem) do app **YouTube Music**, feito em **React Native + Expo**, no formato híbrido ensinado em aula.

## 🎯 Sobre

App com 6 telas principais, navegação por abas + stack, tema visual escuro inspirado no YouTube Music (preto + vermelho), dados mockados de músicas/playlists/álbuns e um player funcional (sem áudio real — é uma mocagem visual/de interação).

## 📱 Telas

1. **Início** — carrosséis de "Ouça de novo", "Feito para você" e "Novos lançamentos"
2. **Buscar** — busca em tempo real por música/artista
3. **Biblioteca** — playlists, álbuns e músicas curtidas
4. **Detalhe da Playlist** — capa, ações (tocar tudo / embaralhar) e lista de músicas
5. **Player** — capa, progresso, like e controles de reprodução (play/pause, próxima, anterior, shuffle, repeat)
6. **Perfil** — dados do usuário, plano e opções de conta

Além disso, um **mini-player fixo** aparece acima da barra de abas, como no app original.

## 🚀 Como rodar

Pré-requisitos: [Node.js](https://nodejs.org/) instalado e o app **Expo Go** no celular (ou um emulador Android/iOS configurado).

```bash
# instalar dependências
npm install

# rodar o projeto
npx expo start
```

Depois é só escanear o QR Code com o app Expo Go (Android) ou a câmera (iOS).

## 📂 Estrutura

```
src/
  screens/       -> uma tela por arquivo
  components/    -> SongItem, MiniPlayer (componentes reutilizáveis)
  navigation/     -> AppNavigator (tabs + stack)
  constants/      -> tema (cores, espaçamentos, tipografia)
  data/           -> dados mockados (músicas, playlists, álbuns, usuário)
```

## 👥 Dupla

- Integrante 1: _(preencher)_
- Integrante 2: _(preencher)_

## 📌 Observações

- Projeto feito para fins acadêmicos, sem vínculo com o Google/YouTube.
- Dados de músicas e usuário são fictícios (mock).
