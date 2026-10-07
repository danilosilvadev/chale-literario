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
- **Independência energética e de água** (seção `#energia`): sol 310 W + alternador + tomada no mesmo banco (~680 Ah), hidráulica completa com água a bordo e água quente, banheiro naval. **Sem inventar números**: capacidade de tanque, tipo de aquecedor e dias de autonomia só entram quando o Dan confirmar.

## Fotos e vídeo

Ainda não há mídia deste veículo no site. Hero, galeria, LED noturno, portas traseiras, walkthrough e os demais enquadramentos são **placeholders** (blocos creme/cinza com legenda). Não usar foto de banco de imagens no lugar.

Quando as fotos existirem, o caminho está em `public/media/README.md` e `src/media-slots.js`.

## Onde mudar o preço

`site.config.json`:

- `priceLabel`: `R$ 139.900` (o que a pessoa lê)
- `priceAmount`: `139900` (número, sem ponto)
