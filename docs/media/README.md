# Pasta de mídia

Coloque aqui **somente fotos e vídeos deste motorhome**. Não use imagem de banco, anúncio de outro veículo ou mockup que pareça a van.

Enquanto o arquivo não existe, a página mostra um bloco creme/cinza com a legenda terminando em “— placeholder”.

## Como trocar um placeholder

1. Exporte a foto já comprimida (JPG ou WebP, lado maior em torno de 2000 px). Vídeo: MP4, de preferência menos de 50 MB.
2. Salve com o nome da tabela abaixo.
3. Em `src/media-slots.js`, troque `null` pelo caminho. O caminho começa com `./media/` e é em relação à página, não a este arquivo.

```js
hero: "./media/hero.jpg",
```

4. Rode de novo `npm run dev` ou `npm run build`.

A legenda visível no placeholder está no `index.html` (`Foto exterior — placeholder`, etc.). Quando o arquivo carrega, a página passa a usar `data-caption` e `data-alt` do mesmo `<figure>`. Ajuste esses dois atributos para descrever a foto real.

Se o caminho estiver errado, o bloco volta a ser placeholder com “arquivo não encontrado”.

## Classes

| Classe | Função |
| --- | --- |
| `.media-slot` | Cada figura (hero, galeria, vídeo) |
| `.media-slot--hero` | Foto grande do topo |
| `.media-slot--wide` | Enquadramento largo na grade |
| `.media-slot--video` | Walkthrough |
| `.media-frame` | Moldura com proporção fixa |
| `.media-placeholder` / `.media-frame--placeholder` | Bloco cinza/creme |
| `.media-frame--photo` | `<img>` ou `<video>` inserido quando há arquivo |
| `data-slot` | Chave igual à de `src/media-slots.js` |

## Arquivos previstos

| `data-slot` | Arquivo sugerido | Legenda do placeholder |
| --- | --- | --- |
| `hero` | `hero.jpg` | Foto exterior — placeholder |
| `frente` | `frente.jpg` | Foto dianteira — placeholder |
| `lateral` | `lateral.jpg` | Foto lateral — placeholder |
| `interior` | `interior.jpg` | Foto interior, dia — placeholder |
| `led` | `led.jpg` | Iluminação noturna, LED — placeholder |
| `portas` | `portas.jpg` | Portas traseiras abertas — placeholder |
| `quarto` | `quarto.jpg` | Quarto traseiro — placeholder |
| `estante` | `estante.jpg` | Estante de livros — placeholder |
| `cozinha` | `cozinha.jpg` | Cozinha — placeholder |
| `banheiro` | `banheiro.jpg` | Banheiro — placeholder |
| `solar` | `solar.jpg` | Placa solar — placeholder |
| `baterias` | `baterias.jpg` | Baterias e quadro elétrico — placeholder |
| `mesa` | `mesa.jpg` | Mesa conversível — placeholder |
| `isolamento` | `isolamento.jpg` | Isolamento — placeholder |
| `walkthrough` | `walkthrough.mp4` | Vídeo walkthrough — placeholder |
