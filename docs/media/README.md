# Pasta de mídia

Fotos reais da van entram aqui **só pelo nome do arquivo**. Não precisa mexer em código: salve a foto com o nome da tabela e rode `npm run build`. Enquanto o arquivo não existe, a página mostra um card com moldura quente, o ícone do cômodo, a legenda e o selo "foto em breve" (nunca a palavra "placeholder").

- Aceita `.jpg`, `.jpeg`, `.webp`, `.png` ou `.avif` com o mesmo nome-base (ex.: `estante-fim-de-tarde.webp` também vale).
- Tamanho sugerido: lado maior até ~1600 px, JPG qualidade ~80 (ou WebP). Horizontal (4:3) funciona melhor.
- Legendas, textos alternativos e ordem ficam em `src/data/gallery.json` (tour de fotos) e `src/data/inventory.json` (catálogo).
- O mosaico do topo da galeria usa os 5 slots de `featured` em `gallery.json`.

## Tour de fotos da landing: `public/media/fotos/`

| Cômodo | Arquivo | Legenda na página |
| --- | --- | --- |
| A cabana e a estante | `estante-fim-de-tarde.jpg` | Estante na luz do fim de tarde |
| A cabana e a estante | `estante-de-frente.jpg` | A estante de ponta a ponta |
| A cabana e a estante | `interior-pinus.jpg` | Pinus tratado no teto e nas molduras |
| A cabana e a estante | `led-noite.jpg` | De noite: luz quente em 4 camadas |
| A cabana e a estante | `interior-porta-lateral.jpg` | A cabana vista da porta lateral |
| Quarto com vista | `quarto-portas-abertas.jpg` | Portas abertas para a serra |
| Quarto com vista | `cafe-na-cama.jpg` | Café na cama com a vista |
| Quarto com vista | `camas.jpg` | Dorme 3: casal + solteiro |
| Cozinha | `cozinha.jpg` | A cozinha da cabana |
| Cozinha | `geladeira.jpg` | Geladeira Resfriar 67 L 12/24 V |
| Cozinha | `pia.jpg` | Pia com água sob pressão |
| Banheiro naval | `banheiro.jpg` | Banheiro naval |
| Banheiro naval | `chuveiro.jpg` | Chuveiro com água quente a gás |
| Banheiro naval | `aquecedor.jpg` | Aquecedor Lorenzetti a gás |
| Energia e água | `placa-solar.jpg` | Placa solar de 310 W |
| Energia e água | `baterias.jpg` | 3 baterias Freedom: 720 Ah |
| Energia e água | `quadro-eletrico.jpg` | Quadro elétrico e inversor 220 V |
| Energia e água | `tanque.jpg` | Tanque de 210 L com quebra-onda |
| Cabine e motor | `cabine.jpg` | Cabine da Master 2006 |
| Cabine e motor | `motor.jpg` | Motor refeito aos 550 mil km |
| Por fora | `exterior-frente.jpg` | Master 2006, de frente |
| Por fora | `exterior-lateral.jpg` | De lado, pronta para a estrada |
| Por fora | `serra.jpg` | Na serra catarinense |

## Catálogo e inventário: `public/media/inventario/`

Com foto real, o card do item usa a foto (e some a legenda "Foto ilustrativa do modelo instalado" dos itens que hoje mostram a imagem do fabricante).

| Categoria | Arquivo | Item |
| --- | --- | --- |
| Estrutura e isolamento | `pinus.jpg` | Revestimento em pinus tratado |
| Estrutura e isolamento | `isolamento.jpg` | Isolamento triplo |
| Energia | `placa-solar.jpg` | Placa solar 310 W |
| Energia | `baterias.jpg` | 3 baterias estacionárias Freedom DF4001 (hoje: foto do fabricante) |
| Energia | `alternador.jpg` | Carga pelo alternador |
| Energia | `tomada.jpg` | Carga pela tomada |
| Energia | `inversor.jpg` | Inversor 220 V |
| Água | `tanque.jpg` | Tanque de 210 L |
| Água | `bomba.jpg` | Bomba d'água de vazão forte |
| Água | `aquecedor.jpg` | Aquecedor Lorenzetti a gás (GLP) com misturador (hoje: foto do fabricante) |
| Cozinha e conforto | `geladeira.jpg` | Geladeira Resfriar 67 L 12/24 V (hoje: foto do fabricante) |
| Cozinha e conforto | `pia.jpg` | Pia com água sob pressão |
| Cozinha e conforto | `climatizador.jpg` | Climatizador Resfriar |
| Cozinha e conforto | `iluminacao.jpg` | Iluminação LED quente em 4 camadas |
| Quarto e estante | `cama-casal.jpg` | Cama de casal na traseira |
| Quarto e estante | `cama-solteiro.jpg` | Cama de solteiro |
| Quarto e estante | `estante.jpg` | Estante de livros |
| Banheiro | `banheiro-naval.jpg` | Banheiro naval |
| Banheiro | `chuveiro.jpg` | Chuveiro com água quente a gás |
| Veículo e documentação | `master.jpg` | Renault Master 2006 |
| Veículo e documentação | `motor.jpg` | Motor refeito aos 550 mil km |
| Veículo e documentação | `documentacao.jpg` | Documentada como motorcasa |
| Veículo e documentação | `revisada.jpg` | Revisada |

## Foto do dono

Salve como `public/media/dono.jpg` (quadrada, ~400 px) e coloque `"ownerPhoto": "./media/dono.jpg"` em `site.config.json`. Ela aparece no bloco "Anúncio oficial único".

## Desligar a galeria

`"showGallery": false` em `site.config.json` esconde mosaico e tour e volta o bloco "Receba fotos e o tour em vídeo no WhatsApp".

Imagens dos fabricantes ficam em `public/equipamentos/`; o mapa estático em `public/mapa/`.
