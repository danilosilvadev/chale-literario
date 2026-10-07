# Conteúdo do anúncio

- **Preço pedido público: R$ 149.900**
- O rascunho antigo de marketing citava R$ 182.000. Esse valor está aposentado e não entra na página, no título nem no texto de WhatsApp.
- Veículo: Renault Master **2006**, quilometragem **cerca de 600.000 km** (aparece na ficha, de forma factual — não como refrão de defeito).
- **Trocas:** aceito até **1/3** do preço pedido em veículo equivalente.
- **Videochamada sem compromisso** é opção explícita (hero, visitas e FAQ).
- Pontos fortes em evidência: hidráulica com água quente, proteção térmica, vedação, motor/sistemas em bom funcionamento, madeira tratada, energia solar.
- **Estante de livros:** destaque forte — linda estante; claim do anúncio: **a maior estante em motorhome da América Latina** (hero, fatos, galeria, capítulos, ficha e FAQ).
- Onde está: Anitápolis, Santa Catarina. Visita também pode ser combinada em São José ou Florianópolis.
- A página não afirma que o documento já é motorcasa. Isso se confirma no CRLV, na visita.

## Fotos e vídeo

Ainda não há mídia deste veículo no site. Hero, galeria, LED noturno, portas traseiras, walkthrough e os demais enquadramentos são **placeholders** (blocos creme/cinza com legenda). Não usar foto de banco de imagens no lugar.

Quando as fotos existirem, o caminho está em `public/media/README.md` e `src/media-slots.js`.

## Onde mudar o preço

`site.config.json`:

- `priceLabel`: `R$ 149.900` (o que a pessoa lê)
- `priceAmount`: `149900` (número, sem ponto)
