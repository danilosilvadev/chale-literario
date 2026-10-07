import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mediaSlots } from '../src/media-slots.js'

const root = path.dirname(fileURLToPath(import.meta.url))
const project = path.resolve(root, '..')
const htmlPath = path.join(project, 'dist', 'index.html')
const html = fs.readFileSync(htmlPath, 'utf8')
const config = JSON.parse(fs.readFileSync(path.join(project, 'site.config.json'), 'utf8'))

function fail(message) {
  console.error(`check-content: ${message}`)
  process.exitCode = 1
}

if (process.exitCode) {
  process.exit(process.exitCode)
}

const leftovers = html.match(/__[A-Z0-9_]+__/g)
if (leftovers) fail(`tokens não substituídos: ${[...new Set(leftovers)].join(', ')}`)

if (!html.includes(config.priceLabel)) fail(`preço "${config.priceLabel}" não está no HTML`)
if (!html.includes(String(config.year))) fail('ano ausente no HTML')
if (!html.includes(config.kilometersLabel)) fail('quilometragem ausente no HTML')
if (!html.includes(String(config.whatsappNumber).replace(/\D/g, ''))) {
  fail('WhatsApp ausente no HTML')
}

const labelDigits = String(config.priceLabel).replace(/\D/g, '')
if (!labelDigits.includes(String(config.priceAmount))) {
  fail('priceLabel e priceAmount divergem em site.config.json')
}

const banned = ['182.000', '182000', 'R$ 182', '182 mil', '149.900', '149900', '680 Ah']
for (const term of banned) {
  if (html.includes(term)) fail(`valor aposentado encontrado no HTML: ${term}`)
}

for (const phrase of [
  'Foto exterior — placeholder',
  'Vídeo walkthrough — placeholder',
  'Anitápolis',
  'São José',
  'Florianópolis',
  'placeholder',
  'motor refeito aos 550 mil km',
  'FIPE até R$ 50 mil',
  'cabana aconchegante',
  'Independência energética e de água',
  'Documentada como motorcasa',
  'sem dívidas',
  'Revisada',
  'Pronta para viajar pela América Latina',
  'a maior estante em motorhome da América Latina',
  'maps.google.com/maps?q=Anit',
  '210 L',
  'aquecedor a gás com misturador',
  'baterias estacionárias Freedom',
  'Inversor 220 V',
  'Resfriar 12 V',
]) {
  if (!html.includes(phrase)) fail(`texto obrigatório ausente: ${phrase}`)
}

if (!html.includes('src="./assets/') || !html.includes('href="./favicon.svg"')) {
  fail('os assets precisam de caminho relativo (base ./) para GitHub Pages')
}
if (/src="\/assets\/|href="\/assets\//.test(html)) {
  fail('caminho absoluto /assets quebra a página num repositório GitHub Pages')
}

if (/<img\b/i.test(html)) {
  fail('o HTML não deve ter <img>. Fotos reais entram por src/media-slots.js')
}
if (/<video\b/i.test(html)) {
  fail('o HTML não deve ter <video> fixo. O walkthrough entra por src/media-slots.js')
}
if (/unsplash|pexels|shutterstock|picsum|placeholder\.com/i.test(html)) {
  fail('referência a banco de imagens no HTML')
}

const slotsInHtml = [...html.matchAll(/data-slot="([^"]+)"/g)].map((match) => match[1])
for (const key of Object.keys(mediaSlots)) {
  if (!slotsInHtml.includes(key)) fail(`slot "${key}" sem elemento na página`)
}
for (const slot of slotsInHtml) {
  if (!(slot in mediaSlots)) fail(`data-slot desconhecido: ${slot}`)
}

for (const [key, src] of Object.entries(mediaSlots)) {
  if (src == null) continue
  if (typeof src !== 'string' || !src.startsWith('./media/')) {
    fail(`${key}: use null ou um caminho "./media/arquivo"`)
  }
  const file = path.join(project, 'public', src.slice(2))
  if (!fs.existsSync(file)) fail(`${key}: arquivo não encontrado em ${file}`)
}

const jsonMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
if (!jsonMatch) fail('JSON-LD ausente')
else {
  const data = JSON.parse(jsonMatch[1])
  if (String(data.offers?.price) !== String(config.priceAmount)) {
    fail('JSON-LD com preço diferente de site.config.json')
  }
  if (String(data.vehicleModelDate) !== String(config.year)) fail('JSON-LD com ano divergente')
}

const style = fs.readFileSync(path.join(project, 'src', 'style.css'), 'utf8')
const urls = style.match(/url\(([^)]+)\)/g) || []
for (const url of urls) {
  if (!url.includes('data:')) fail(`CSS com url que não é data URI: ${url}`)
}

if (process.exitCode) process.exit(process.exitCode)
console.log('check-content: anúncio, placeholders e config conferidos.')
