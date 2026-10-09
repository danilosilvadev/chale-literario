import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Layout do GitHub Pages (branch main, pasta /docs, domínio vistasobrerodas.com.br neste repo):
//   docs/                  <- raiz do domínio: CNAME, index.html (redireciona p/ /chale-literario/), 404.html, motorhome-venda/
//   docs/chale-literario/  <- o site buildado (dist/)
// Os arquivos da raiz vêm de pages-root/ e são recopiados a cada build.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const docs = path.join(root, 'docs')
const site = path.join(docs, 'chale-literario')
const pagesRoot = path.join(root, 'pages-root')

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('export-pages: dist/index.html não existe. Rode o build antes.')
  process.exit(1)
}

fs.rmSync(site, { recursive: true, force: true })
fs.mkdirSync(docs, { recursive: true })
fs.cpSync(dist, site, { recursive: true })
fs.writeFileSync(path.join(site, '.nojekyll'), '')
fs.cpSync(pagesRoot, docs, { recursive: true })
if (!fs.existsSync(path.join(docs, 'CNAME'))) {
  console.error('export-pages: docs/CNAME sumiu; confira pages-root/CNAME.')
  process.exit(1)
}
console.log('export-pages: site em docs/chale-literario/, raiz do domínio (CNAME, redirects) em docs/.')
