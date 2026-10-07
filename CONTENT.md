# Conteúdo do anúncio

- **Preço pedido público: R$ 139.900** (desde out/2026; antes R$ 149.900).
- O rascunho antigo de marketing citava R$ 182.000. Esse valor está aposentado e não entra na página, no título nem no texto de WhatsApp.
- Veículo: Renault Master **2006**, quilometragem **cerca de 600.000 km** (aparece na ficha, de forma factual — não como refrão de defeito). Sempre que a km aparecer, vem junto com o **motor refeito aos 550 mil km** (apenas ~50 mil km desde a retífica). Não mencionar notas/comprovantes.
- **Trocas:** aceito **carro com FIPE até R$ 50 mil como parte do pagamento**; o restante em dinheiro/transferência. (Substitui a antiga regra "até 1/3 em veículo equivalente".) Destaque no hero/preço, fatos, ficha, seção de preço e FAQ.
- **Videochamada sem compromisso** é opção explícita (hero, visitas e FAQ).
- **Motor refeito aos 550 mil km — apenas ~50 mil km desde a retífica:** destaque mecânico (hero, fatos, veículo, ficha, preço e FAQ).
- Pontos fortes em evidência: hidráulica com água quente, proteção térmica, vedação, motor/sistemas em bom funcionamento, madeira tratada, energia solar.
- **Estante de livros:** destaque forte — linda estante; claim do anúncio: **a maior estante em motorhome da América Latina** (hero, fatos, galeria, capítulos, ficha e FAQ).
- Onde está: Anitápolis, Santa Catarina. **Visita presencial só em Anitápolis** — o interessado vem até a casa; o vendedor não vai ao comprador nem marca ponto em São José/Florianópolis. Videochamada sem compromisso continua ok como prévia remota.
- **Documentação (confirmado pelo Dan em 07/10/2026):** documentada como **motorcasa** no CRLV; em dia, **sem dívidas**; **revisada**; **pronta para viajar pela América Latina**. Selos no hero, linha "Documentação"/"Estado" na ficha, FAQ e rodapé.
- **Narrativa (out/2026): "motorhome cabana aconchegante".** Hero: "Uma cabana aconchegante sobre rodas". A estante é o coração da casa: pinus tratado, luz quente em quatro camadas, livros, quarto traseiro com a vista entrando pelas portas.
- **Independência energética e de água** (seção `#energia`), fatos confirmados pelo Dan em 07/10/2026: sol 310 W + alternador + tomada; **3 baterias estacionárias Freedom DF4001 240 Ah (720 Ah no total, nominal em 12 V) + bateria do motor 110 Ah** (o antigo "680 Ah" está proibido pelo check); **inversor 220 V**; **tanque de água limpa de 210 L para motorhome, com quebra-onda e conexão 1/2"**, bomba de vazão forte, enche com mangueira; **aquecedor Lorenzetti a gás (GLP) com misturador**, LZ 750BP, exaustão natural (banho quente fora do camping é verdade); **geladeira Resfriar 67 L 12/24 V** (modelo para caminhão e motorhome, ref. RESGED67); **dorme 3** (cama de casal + cama de solteiro). Autonomia: sem número de dias; usar o exemplo real "notebook o dia todo e climatizador Resfriar a noite inteira". Não citar peso das baterias: o Dan falou ~50 kg, mas a ficha oficial da DF4001 dá 60,3 kg.
- **Revisada:** dizer só "revisada" (sem data, sem detalhar o tipo de revisão). **Nunca** afirmar que já viajou para fora do Brasil; "pronta para viajar pela América Latina" vale pela documentação.

## Fotos e vídeo

Ainda não há mídia deste veículo no site. Hero, galeria, LED noturno, portas traseiras, walkthrough e os demais enquadramentos são **placeholders** (blocos creme/cinza com legenda). Não usar foto de banco de imagens no lugar.

Quando as fotos existirem, o caminho está em `public/media/README.md` e `src/media-slots.js`.

## Onde mudar o preço

`site.config.json`:

- `priceLabel`: `R$ 139.900` (o que a pessoa lê)
- `priceAmount`: `139900` (número, sem ponto)


## Equipamentos (seção `#equipamentos`)

Imagens de referência, separadas da galeria de fotos reais (que segue com placeholders até chegarem as fotos do Dan). Arquivos em `public/equipamentos/`, WebP, `loading="lazy"`. Cada card tem legenda: **"Foto ilustrativa do modelo instalado"** (modelo confirmado), **"Imagem ilustrativa · linha Resfriar"** (linha confirmada, modelo exato não) ou **"Imagem ilustrativa · ícone"** (sem foto).

| Card | Arquivo | Fonte da imagem |
| --- | --- | --- |
| 3 baterias Freedom DF4001 240 Ah (720 Ah) | `bateria-freedom-df4001.webp` | Site oficial Freedom (Clarios): https://www.freedomestacionaria.com.br/components/card/df4100.png, card da página https://www.freedomestacionaria.com.br/produtos. O site lista a DF4100, sucessora da DF4001 (mesma família 240 Ah C100; a etiqueta da foto mostra DF4001). Referência do Dan: https://www.mercadolivre.com.br/bateria-estacionaria-freedom-df4001-12v-240ah/up/MLBU1368531455 |
| Geladeira Resfriar 67 L 12/24 V | `geladeira-resfriar-67l.webp` | Site oficial Resfriar, RESGED67 (12/24 VDC, caminhão/motorhome): https://www.resfriar.com.br/produto/geladeira-67-litros-externa, imagem https://resfriar.com.br/images/produtos/a939eb423467a487498def982e21a8cf.png. Referência do Dan: https://www.mercadolivre.com.br/geladeira-caminhao-resfriar-67-litros-bivolt-1224v/up/MLBU1754018119 |
| Climatizador Resfriar (topo de linha) | `climatizador-resfriar.webp` | Site oficial Resfriar, Série 8 Inspire (topo de linha atual): https://www.resfriar.com.br/produto/climatizador-serie-8-inspire-s8-inspire, imagem https://resfriar.com.br/images/produtos/bbb90b709288471895eab16779a81ef5.png. **Modelo exato do Dan não confirmado**, por isso a legenda "Imagem ilustrativa · linha Resfriar". |
| Aquecedor Lorenzetti a gás (GLP) com misturador | `aquecedor-lorenzetti-lz750bp.webp` | Site oficial Lorenzetti: https://www.lorenzetti.com.br/produto/lz-750bp, imagem https://www.lorenzetti.com.br/images/default-source/produtos-png/aquecedores-a-gas/lz-750-bp.png. Referência do Dan: https://www.mercadolivre.com.br/aquecedor-a-gas-glp-lorenzetti-lz750bp-exaustao-natural/up/MLBU1719948014 |
| Inversor 220 V | (ícone) | Marca/modelo não informados. |
| Bomba d'água de vazão forte | (ícone) | Marca/modelo não informados. |
| Tanque de 210 L com quebra-onda | (ícone, por enquanto) | Modelo confirmado pelo Dan (https://www.mercadolivre.com.br/caixa-d-agua-210-l-p-motorhome-c-quebra-onda-e-conexao-12/up/MLBU1730285061), mas o Mercado Livre bloqueia o download automático. Para trocar: salvar a foto do produto em `public/equipamentos/tanque-210l-quebra-onda.webp` (~800 px), trocar o ícone por `<img ... loading="lazy">` e a legenda por "Foto ilustrativa do modelo instalado". |
| Placa solar 310 W | (ícone) | Marca/modelo não informados. |
