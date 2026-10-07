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

const banned = ['182.000', '182000', 'R$ 182', '182 mil', '149.900', '149900', '680 Ah', 'refletivo térmico', 'anti-ruído']
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
  'aquecedor Lorenzetti a gás (GLP) com misturador',
  'quebra-onda',
  'Isolamento triplo: massa antirruído + manta térmica + 3TC',
  'Freedom DF4001 240 Ah (720 Ah no total)',
  'LZ 750BP',
  'baterias estacionárias Freedom',
  'Inversor 220 V',
  'Resfriar 67 L 12/24 V',
]) {
  if (!html.includes(phrase)) fail(`texto obrigatório ausente: ${phrase}`)
}

if (!html.includes('src="./assets/') || !html.includes('href="./favicon.svg"')) {
  fail('os assets precisam de caminho relativo (base ./) para GitHub Pages')
}
if (/src="\/assets\/|href="\/assets\//.test(html)) {
  fail('caminho absoluto /assets quebra a página num repositório GitHub Pages')
}

// <img> só na seção Equipamentos (imagens de referência do fabricante, em public/equipamentos/).
// Fotos reais da van continuam entrando por src/media-slots.js.
const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0])
for (const tag of imgs) {
  const src = tag.match(/\ssrc="([^"]+)"/)?.[1] || ''
  if (!src.startsWith('./equipamentos/')) fail(`<img> fora de ./equipamentos/: ${src || tag}`)
  else if (!fs.existsSync(path.join(project, 'public', src.slice(2)))) fail(`imagem ausente: ${src}`)
  if (!/\sloading="lazy"/.test(tag)) fail(`<img> sem loading="lazy": ${src}`)
  if (!/\salt="[^"]+"/.test(tag)) fail(`<img> sem alt: ${src}`)
  if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) fail(`<img> sem width/height: ${src}`)
}
if (!html.includes('id="equipamentos"')) fail('seção Equipamentos ausente')
if (!html.includes('Foto ilustrativa do modelo instalado')) fail('legenda "Foto ilustrativa do modelo instalado" ausente')
const equipCards = (html.match(/class="equip-card[" ]/g) || []).length
const equipNotes = (html.match(/class="equip-note"/g) || []).length
if (equipCards < 9 || equipNotes !== equipCards) fail(`Equipamentos: ${equipCards} cards e ${equipNotes} legendas (cada card precisa da legenda)`)
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
