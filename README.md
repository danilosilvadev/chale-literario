# A casa que escolhe sua vista

Página estática, em português, do motorhome à venda: Renault Master 2006, cerca de 600.000 km com motor refeito aos 550 mil km (apenas ~50 mil km desde a retífica), em Anitápolis (SC). O preço pedido é **R$ 139.900**.

Não é um gerenciador de conteúdo. O texto mora no `index.html`. Preço, ano, quilometragem e WhatsApp saem do `site.config.json` na hora do build. Fotos ainda não existem: a galeria mostra cards "foto em breve" gerados de `src/data/gallery.json` — veja `CONTENT.md`.

## No ar (GitHub Pages + domínio)

URL pública: **https://vistasobrerodas.com.br/chale-literario/** (catálogo em `/chale-literario/catalogo.html`).

O site é exportado em `docs/` com caminhos relativos (`base: './'` no Vite), então funciona nesse caminho de projeto e também no espelho `https://danilosilvadev.github.io/chale-literario/` enquanto o DNS do domínio customizado propaga.

Pages deste repositório: branch `main`, pasta `/docs`. O site raiz `danilosilvadev.github.io` redireciona `/` para `/chale-literario/`; o CNAME `vistasobrerodas.com.br` entra lá quando o DNS no Registro.br apontar para o GitHub.


Cada mudança de texto, preço ou foto pede um build novo e um commit da pasta `docs/`:

```bash
npm run build
git add docs
git commit -m "Atualiza a página publicada"
git push
```

Há um workflow opcional em `.github/workflows/pages.yml` (só manual) que publica `dist/` via GitHub Actions. Use um ou outro. Com a pasta `/docs` ligada, deixe esse workflow desligado.

## Rodar localmente

Requer Node 20 ou mais novo.

```bash
npm install
npm run dev
```

Abre em [http://127.0.0.1:4317](http://127.0.0.1:4317).

Para ver a versão de produção:

```bash
npm run build
npm run preview
```

O build gera `dist/`, confere preço, ano, quilometragem, links de WhatsApp, ausência de "placeholder" e de links de saída, e caminhos relativos (`scripts/check-content.mjs`) e copia o resultado para `docs/`. O valor antigo de rascunho, R$ 182.000, não pode aparecer na página.

## Preço

Edite `site.config.json`:

```json
{
  "priceLabel": "R$ 139.900",
  "priceAmount": 139900
}
```

`priceLabel` é o texto visível. `priceAmount` é o número inteiro, sem ponto, usado no dado estruturado. Os dois precisam ser o mesmo valor. Ano e quilometragem ficam no mesmo arquivo (`year`, `kilometersLabel`, `kilometersValue`).

## WhatsApp

O número publicado é o WhatsApp do Dan, **(51) 99202-2580** (`5551992022580`). Ele aparece visível no bloco "Anúncio oficial único" e no rodapé, e todos os links `wa.me` levam mensagem pronta (as 6 variantes estão em `vite.config.js`, `waMessages`, e documentadas no `CONTENT.md`). O `check-content` falha se o antigo número de exemplo voltar.

Use só dígitos, com DDI 55 (ex.: `5551992022580`).

Há duas formas. A primeira que existir, e não estiver vazia, ganha:

1. Variável de ambiente `WHATSAPP_NUMBER` (arquivo `.env` na raiz, a partir de `.env.example`, ou segredo no deploy).
2. Campo `whatsappNumber` em `site.config.json`.

```bash
cp .env.example .env
```

No `.env`:

```bash
WHATSAPP_NUMBER=5551992022580
```

Troque pelo número de verdade e rode `npm run dev` ou `npm run build` de novo. Todos os botões abrem `https://wa.me/` com uma mensagem pronta. Não há formulário: a seção de contato tem 3 botões de intenção (Quero ver por vídeo, Tenho carro para troca, Tenho uma dúvida), cada um com a sua mensagem.

## Fotos e vídeo

Não coloque foto de banco de imagens. A galeria (mosaico, tour por cômodo e lightbox) e o catálogo (`catalogo.html`) são gerados no build a partir de `src/data/gallery.json` e `src/data/inventory.json` (`scripts/blocks.mjs`). Foto nova entra só salvando o arquivo com o nome certo em `public/media/fotos/` ou `public/media/inventario/`; a lista completa está em `public/media/README.md`. `"showGallery": false` esconde a galeria. A foto do dono entra por `"ownerPhoto"` no mesmo `site.config.json`.

## Publicar na Vercel

1. Importe o repositório na Vercel.
2. Framework: Vite. Build: `npm run build`. Pasta de saída: `dist` (também está no `vercel.json`).
3. Em Environment Variables, defina `WHATSAPP_NUMBER` com o número real e faça um novo deploy.

Não é preciso configurar base. A Vercel publica na raiz do domínio.

## O que tem no repositório

| Arquivo | Função |
| --- | --- |
| `index.html` | Página do anúncio |
| `src/style.css` | Visual |
| `src/main.js` | Animações e marca de origem (utm) na mensagem do WhatsApp |
| `catalogo.html` | Catálogo completo e inventário (segunda página do build) |
| `src/gallery.js` | Mosaico/carrossel, tour de fotos, lightbox e scroll-spy |
| `src/data/gallery.json` | Cômodos e fotos do tour |
| `src/data/inventory.json` | Itens do catálogo |
| `scripts/blocks.mjs` | Gera o HTML da galeria e do catálogo no build |
| `src/partials/sprite.svg` | Ícones usados pelas duas páginas |
| `site.config.json` | Preço, ano, km e WhatsApp padrão |
| `.env.example` | Modelo da variável `WHATSAPP_NUMBER` |
| `public/media/` | Arquivos reais, quando existirem |
| `CONTENT.md` | Preço pedido e o combinado sobre as fotos |
| `docs/` | Site já buildado, pronto para GitHub Pages (`main` / `/docs`) |
