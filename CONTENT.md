# Conteúdo do anúncio

- **Preço pedido público: R$ 139.900** (desde out/2026; antes R$ 149.900).
- O rascunho antigo de marketing citava R$ 182.000. Esse valor está aposentado e não entra na página, no título nem no texto de WhatsApp.
- Veículo: Renault Master **2006**, quilometragem **cerca de 600.000 km** (aparece na ficha, de forma factual — não como refrão de defeito). Sempre que a km aparecer, vem junto com o **motor refeito aos 550 mil km** (apenas ~50 mil km desde a retífica). Não mencionar notas/comprovantes.
- **Trocas:** aceito **carro com FIPE até R$ 50 mil como parte do pagamento**; o restante em dinheiro/transferência. (Substitui a antiga regra "até 1/3 em veículo equivalente".) Destaque no hero/preço, fatos, ficha, seção de preço e FAQ.
- **Funil (v3, out/2026):** o único trabalho da página é levar a pessoa ao **WhatsApp** (wa.me/5551992022580 com mensagem pronta). Videochamada e visita são combinadas dentro do WhatsApp; a página só menciona a videochamada no FAQ e no texto de contato.
- **Motor refeito aos 550 mil km — apenas ~50 mil km desde a retífica:** destaque mecânico (cartão do hero, seção "A base", ficha e FAQ; sem repetir em cada bloco).
- Pontos fortes em evidência: hidráulica com água quente, **Isolamento triplo: massa antirruído + manta térmica + 3TC** (confirmado pelo Dan em 07/10/2026; substitui a descrição antiga "manta/refletivo/lã"), vedação, motor/sistemas em bom funcionamento, madeira tratada, energia solar.
- **Estante de livros:** destaque forte; claim do anúncio: **a maior estante de livros em motorhome da América Latina (até onde sei)**. Aparece 1× com destaque (hero) e 1× na ficha. Não usar "linda estante" (o check bloqueia).
- Onde está: Anitápolis, Santa Catarina. **Visita presencial só em Anitápolis** — o interessado vem até a casa; na página isso é dito de forma positiva ("a visita é aqui em Anitápolis"), sem "não marcamos"/"mais embaixo". Videochamada sem compromisso continua ok como prévia remota.
- **Documentação (confirmado pelo Dan em 07/10/2026):** documentada como **motorcasa** no CRLV; em dia, **sem dívidas**; **revisada**; **pronta para viajar pela América Latina**. Selos no hero, linha "Documentação"/"Estado" na ficha, FAQ e rodapé.
- **Narrativa (out/2026): "motorhome cabana aconchegante".** Hero: "Uma cabana aconchegante sobre rodas". A estante é o coração da casa: pinus tratado, luz quente em quatro camadas, livros, quarto traseiro com a vista entrando pelas portas.
- **Independência energética e de água** (seção `#energia`), fatos confirmados pelo Dan em 07/10/2026: sol 310 W + alternador + tomada; **3 baterias estacionárias Freedom DF4001 240 Ah (720 Ah no total, nominal em 12 V) + bateria do motor 110 Ah** (o antigo "680 Ah" está proibido pelo check); **inversor 220 V**; **tanque de água limpa de 210 L para motorhome, com quebra-onda e conexão 1/2"**, bomba de vazão forte, enche com mangueira; **aquecedor Lorenzetti a gás (GLP) com misturador**, LZ 750BP, exaustão natural (banho quente fora do camping é verdade); **geladeira Resfriar 67 L 12/24 V** (modelo para caminhão e motorhome, ref. RESGED67); **dorme 3** (cama de casal + cama de solteiro). Autonomia: sem número de dias; usar o exemplo real "notebook o dia todo e climatizador Resfriar a noite inteira". Não citar peso das baterias: o Dan falou ~50 kg, mas a ficha oficial da DF4001 dá 60,3 kg.
- **Revisada:** dizer só "revisada" (sem data, sem detalhar o tipo de revisão). **Nunca** afirmar que já viajou para fora do Brasil; "pronta para viajar pela América Latina" vale pela documentação.

## Fotos: galeria estilo Airbnb e catálogo (v4, out/2026)

- **Galeria ligada** (`"showGallery": true`). Seção `#fotos`: mosaico 1 grande + 4 pequenas no desktop; carrossel com snap e bolinhas no celular; botão "Ver todas as fotos" abre o **tour de fotos** em tela cheia (`#tour`), por cômodo, com chips fixos e scroll-spy; clique em qualquer foto abre o lightbox (deslizar, setas do teclado, Esc).
- Cômodos: A cabana e a estante · Quarto com vista · Cozinha · Banheiro naval · Energia e água · Cabine e motor · Por fora. Dados em `src/data/gallery.json` (cômodo, id, arquivo, legenda, alt).
- Ainda **não há fotos reais**: cada slot mostra um card com moldura, ícone, legenda e "foto em breve". Para trocar: salvar o arquivo com o nome do JSON em `public/media/fotos/` e rodar o build (lista em `public/media/README.md`).
- **Catálogo completo e inventário**: página `catalogo.html` (build multi-página do Vite, publicada em `docs/catalogo.html`). 7 categorias, 23 itens, só fatos confirmados. Dados em `src/data/inventory.json`; fotos reais em `public/media/inventario/`. Bateria Freedom DF4001, geladeira Resfriar e aquecedor Lorenzetti usam a imagem do fabricante com "Foto ilustrativa do modelo instalado".
- Funil do catálogo: só sai para o WhatsApp (mensagem "Oi! Vi o catálogo completo do motorhome…") ou volta para a landing. Barra fixa no celular.
- Botões "Ver catálogo completo e inventário": na galeria, no fim do tour e na Ficha (logo após Equipamentos). Menu: Fotos · Catálogo · Dúvidas.
- O "Cozinha" fala só do confirmado: pia com água sob pressão, geladeira, luz de teto. Nada de bancada PU 55, mesa conversível nem fogão.

**Foto do dono:** `"ownerPhoto": null` em `site.config.json`. Com uma foto (ex.: `"./media/dono.jpg"`), ela aparece no bloco "Anúncio oficial único".

## Pendente de confirmação do Dan (fora da página por enquanto)

Estes itens estavam no texto antigo ou na auditoria, mas o Dan não confirmou. **Não voltam para a página, anúncios ou mensagens até ele confirmar:**

- Construção **sem MDF**
- Bancada em **PU 55**
- Piso do banheiro em **eucalipto**
- **Mesa conversível** (vira cama/área de trabalho)
- **Proteção anti-impacto** da estante (livros presos na estrada)
- Vedação com **PU náutico**
- Uso de **~3 km por dia em estrada de terra**
- **Nome do dono** na página (usar "o dono"/"eu" até ele liberar) e **foto do dono**
- **Ano/tempo de construção** da casa
- **Financiamento**: não prometer (nem citar) até haver condição real
- Modelo exato do **climatizador** e do **inversor** (cards só com ícone)

O check (`scripts/check-content.mjs`) bloqueia MDF, PU 55, eucalipto, PU náutico, "conversível", "km por dia", "anti-impacto" e "financiamento".

## WhatsApp: mensagens prontas

Todas em `vite.config.js` (`waMessages`), número em `site.config.json`. Cada botão abre `https://wa.me/5551992022580?text=…`:

| Chave | Onde | Mensagem |
| --- | --- | --- |
| `padrao` | header, hero, rodapé, barra fixa | Oi! Vi a cabana sobre rodas no site e quero saber mais. Sou de ____. |
| `video` | botão "Quero ver por vídeo", seção A cabana | Oi! Vi a cabana no site e queria ver ela ao vivo por vídeo. Sou de ____ e posso em ____. |
| `troca` | botão "Tenho carro para troca", seção Preço | Oi! Vi a cabana no site. Tenho um carro para dar como parte do pagamento: ____ (modelo/ano). |
| `duvida` | botão "Tenho uma dúvida", Energia, Ficha, FAQ | Oi! Vi a cabana no site e fiquei com uma dúvida: ____ |
| `fotos` | link "Eu mando pelo WhatsApp" na galeria (e o bloco de fotos, se a galeria for desligada) | Oi! Vi a cabana no site e queria receber as fotos e o vídeo do tour. Sou de ____. |
| `motor` | seção A base | Oi! Vi a cabana no site e queria ver o vídeo do motor funcionando. Sou de ____. |
| `catalogo` | catálogo: header, topo, fim, rodapé, barra fixa | Oi! Vi o catálogo completo do motorhome no site e quero saber mais. Sou de ____. |
| `item` | catálogo: "Pedir foto de um item" | Oi! Vi o catálogo completo do motorhome e queria fotos ou detalhes de: ____ |

Se o link tiver `?utm_source=olx` (ou `?ref=olx`), o `src/main.js` acrescenta " (ref: olx)" ao fim da mensagem, para saber de qual anúncio veio o contato.

## Âncora de preço (seção `#preco`)

- R$ 139.900 (pedido).
- **R$ 169.900: mediana de 39 motorhomes comparáveis à venda** (levantamento de anúncios ativos, out/2026, em `/workspace/motorhome-sell-chances-report.md`).
- **Sem investimento do dono / custo de construção** (decisão do Dan, 07/10/2026): o bloco "~R$ 100 mil na conversão" saiu da página, e o check bloqueia "Investimento do dono", "100 mil", "mão de obra", "do zero" e afins. A âncora fica só no preço vs. mediana (R$ 30 mil abaixo).

## Saídas da página

Sem links para fora além do WhatsApp: sem link do Google Maps (o mapa é uma imagem estática em `public/mapa/anitapolis.webp`, feita com tiles do OpenStreetMap, com crédito na legenda) e sem link do gov.br/CONTRAN. Menu com 3 itens (Fotos, Catálogo, Dúvidas); o catálogo é página interna e barra fixa de WhatsApp no celular.

## Onde mudar o preço

`site.config.json`:

- `priceLabel`: `R$ 139.900` (o que a pessoa lê)
- `priceAmount`: `139900` (número, sem ponto)


## Equipamentos (seção `#equipamentos`)

Imagens de referência, separadas da galeria de fotos reais (desligada até chegarem as fotos do Dan). Na v3 fica dentro da Ficha, como acordeão "Equipamentos instalados (marcas e modelos)", com `id="equipamentos"`. Arquivos em `public/equipamentos/`, WebP, `loading="lazy"`. Cada card tem legenda: **"Foto ilustrativa do modelo instalado"** (modelo confirmado), **"Imagem ilustrativa · ícone"** (sem foto).

| Card | Arquivo | Fonte da imagem |
| --- | --- | --- |
| 3 baterias Freedom DF4001 240 Ah (720 Ah) | `bateria-freedom-df4001.webp` | Site oficial Freedom (Clarios): https://www.freedomestacionaria.com.br/components/card/df4100.png, card da página https://www.freedomestacionaria.com.br/produtos. O site lista a DF4100, sucessora da DF4001 (mesma família 240 Ah C100; a etiqueta da foto mostra DF4001). Referência do Dan: https://www.mercadolivre.com.br/bateria-estacionaria-freedom-df4001-12v-240ah/up/MLBU1368531455 |
| Geladeira Resfriar 67 L 12/24 V | `geladeira-resfriar-67l.webp` | Site oficial Resfriar, RESGED67 (12/24 VDC, caminhão/motorhome): https://www.resfriar.com.br/produto/geladeira-67-litros-externa, imagem https://resfriar.com.br/images/produtos/a939eb423467a487498def982e21a8cf.png. Referência do Dan: https://www.mercadolivre.com.br/geladeira-caminhao-resfriar-67-litros-bivolt-1224v/up/MLBU1754018119 |
| Climatizador Resfriar (topo de linha) | (ícone) | Modelo exato não confirmado; card só com ícone, sem modelo específico (decisão do Dan, 07/10/2026). Se o Dan confirmar o modelo, a Série 8 Inspire tem foto oficial em https://www.resfriar.com.br/produto/climatizador-serie-8-inspire-s8-inspire |
| Aquecedor Lorenzetti a gás (GLP) com misturador | `aquecedor-lorenzetti-lz750bp.webp` | Site oficial Lorenzetti: https://www.lorenzetti.com.br/produto/lz-750bp, imagem https://www.lorenzetti.com.br/images/default-source/produtos-png/aquecedores-a-gas/lz-750-bp.png. Referência do Dan: https://www.mercadolivre.com.br/aquecedor-a-gas-glp-lorenzetti-lz750bp-exaustao-natural/up/MLBU1719948014 |
| Inversor 220 V | (ícone) | Marca/modelo não informados. |
| Bomba d'água de vazão forte | (ícone) | Marca/modelo não informados. |
| Tanque de 210 L com quebra-onda | (ícone, por enquanto) | Modelo confirmado pelo Dan (https://www.mercadolivre.com.br/caixa-d-agua-210-l-p-motorhome-c-quebra-onda-e-conexao-12/up/MLBU1730285061), mas o Mercado Livre bloqueia o download automático. Para trocar: salvar a foto do produto em `public/equipamentos/tanque-210l-quebra-onda.webp` (~800 px), trocar o ícone por `<img ... loading="lazy">` e a legenda por "Foto ilustrativa do modelo instalado". |
| Placa solar 310 W | (ícone) | Marca/modelo não informados. |
| Isolamento triplo | (ícone) | Massa antirruído + manta térmica + 3TC; sem foto de fabricante. |
