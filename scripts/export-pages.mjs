import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const docs = path.join(root, 'docs')

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('export-pages: dist/index.html não existe. Rode o build antes.')
  process.exit(1)
}

fs.rmSync(docs, { recursive: true, force: true })
fs.cpSync(dist, docs, { recursive: true })
fs.writeFileSync(path.join(docs, '.nojekyll'), '')
console.log('export-pages: site copiado para docs/ (GitHub Pages, branch main, pasta /docs).')
