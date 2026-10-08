# Pasta de mídia

Fotos e vídeo reais da van entram aqui. Hoje a pasta está vazia e a galeria está **desligada** (`"showGallery": false` em `site.config.json`). No lugar dela a página mostra o bloco "Receba fotos e o tour em vídeo no WhatsApp". Nenhum texto "placeholder" aparece para o visitante.

## Como ligar a galeria

1. Exporte as fotos em JPG ou WebP (lado maior até ~1600 px) e o vídeo em MP4.
2. Salve aqui com os nomes da tabela abaixo.
3. Em `src/media-slots.js`, troque cada `null` pelo caminho (começa com `./media/`, relativo à página).
4. Em `site.config.json`, mude `"showGallery"` para `true`.
5. Rode `npm run build`. O check falha se a galeria estiver ligada com algum slot ainda vazio, ou se houver arquivo faltando.

Se uma foto não carregar no navegador, o bloco mostra só a legenda (sem a palavra "placeholder").

## Foto do dono

Salve como `public/media/dono.jpg` (quadrada, ~400 px) e coloque `"ownerPhoto": "./media/dono.jpg"` em `site.config.json`. Ela aparece no bloco "Anúncio oficial único". Com `null`, o bloco fica só com texto.

## Arquivos previstos

| `data-slot` | Arquivo sugerido | Legenda na página |
| --- | --- | --- |
| `hero` | `hero.jpg` | Foto grande do topo (exterior ou interior com luz quente) |
| `leitura` | `leitura.jpg` | Fim de tarde: a luz dourada na estante de livros |
| `quarto` | `quarto.jpg` | Café na cama, portas abertas |
| `led` | `led.jpg` | De noite: luz quente em 4 camadas |
| `interior` | `interior.jpg` | Pinus tratado, de ponta a ponta |
| `banho` | `banho.jpg` | Banho quente a gás, longe da tomada |
| `agua` | `agua.jpg` | 210 L de água; enche com mangueira |
| `solar` | `solar.jpg` | Placa solar de 310 W |
| `baterias` | `baterias.jpg` | 3 baterias estacionárias Freedom: 720 Ah |
| `geladeira` | `geladeira.jpg` | Geladeira Resfriar 67 L 12/24 V |
| `camas` | `camas.jpg` | Dorme 3: casal + solteiro |
| `banheiro` | `banheiro.jpg` | Banheiro naval |
| `motor` | `motor.jpg` | Motor refeito aos 550 mil km |
| `exterior` | `exterior.jpg` | Master 2006 por fora |
| `serra` | `serra.jpg` | Ela mora aqui: serra catarinense |
| `walkthrough` | `walkthrough.mp4` | Tour em vídeo |

As legendas ficam no `index.html` (`data-caption` e `data-alt` de cada figura). Imagens dos fabricantes (Equipamentos) ficam em `public/equipamentos/`, e o mapa estático em `public/mapa/`.
