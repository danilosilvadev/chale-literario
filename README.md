# A casa que escolhe sua vista

Página estática, em português, do motorhome à venda: Renault Master 2006, cerca de 600.000 km com motor refeito aos 550 mil km (apenas ~50 mil km desde a retífica), em Anitápolis (SC). O preço pedido é **R$ 139.900**.

Não é um gerenciador de conteúdo. O texto mora no `index.html`. Preço, ano, quilometragem e WhatsApp saem do `site.config.json` na hora do build. Fotos ainda são placeholders — veja `CONTENT.md`.

## Prévia no ar (GitHub Pages)

O site já está exportado em `docs/`, com caminhos relativos (`base: './'` no Vite). Isso serve na raiz de um domínio e também em `https://<usuario>.github.io/<repositorio>/`.

Este projeto ainda é um rascunho: não há repositório público no GitHub, então a URL da Pages ainda não existe. Assim que o repositório for publicado ou espelhado no GitHub, ligue a Pages — não precisa de outro build:

1. No GitHub, abra **Settings → Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**.
3. Branch **`main`**, pasta **`/docs`**, e salve.
4. A URL aparece no topo dessa tela, em geral em um ou dois minutos.

Se a conta for `danilosilvadev`, o endereço fica:

`https://danilosilvadev.github.io/<nome-do-repositorio>/`

O nome do repositório é o que você escolher ao publicar. A tela de Pages mostra o link definitivo.

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

O build gera `dist/`, confere preço, ano, quilometragem, placeholders e caminhos relativos (`scripts/check-content.mjs`) e copia o resultado para `docs/`. O valor antigo de rascunho, R$ 182.000, não pode aparecer na página.

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

O número publicado hoje é o placeholder **5500000000000**. Não é um telefone real. Enquanto ele estiver assim, a página mostra um aviso no topo e pede para os buscadores não indexarem.

Use só dígitos, com DDI 55 (exemplo real: `5548999999999`).

Há duas formas. A primeira que existir, e não estiver vazia, ganha:

1. Variável de ambiente `WHATSAPP_NUMBER` (arquivo `.env` na raiz, a partir de `.env.example`, ou segredo no deploy).
2. Campo `whatsappNumber` em `site.config.json`.

```bash
cp .env.example .env
```

No `.env`:

```bash
WHATSAPP_NUMBER=5500000000000
```

Troque pelo número de verdade e rode `npm run dev` ou `npm run build` de novo. O botão e o formulário abrem `https://wa.me/` com uma mensagem pronta. O formulário (nome, cidade, quando pode visitar) não envia dados para servidor nenhum: só monta o texto no navegador.

## Fotos e vídeo

Não coloque foto de banco de imagens. O passo a passo, os nomes de arquivo e as classes (`.media-slot`, `.media-placeholder`, `.media-frame--photo`, `data-slot`) estão em `public/media/README.md`. O mapa dos arquivos é `src/media-slots.js`.

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
| `src/main.js` | Menu, formulário do WhatsApp, troca dos placeholders |
| `src/media-slots.js` | Onde ligar cada foto ou vídeo |
| `site.config.json` | Preço, ano, km e WhatsApp padrão |
| `.env.example` | Modelo da variável `WHATSAPP_NUMBER` |
| `public/media/` | Arquivos reais, quando existirem |
| `CONTENT.md` | Preço pedido e o combinado sobre as fotos |
| `docs/` | Site já buildado, pronto para GitHub Pages (`main` / `/docs`) |
