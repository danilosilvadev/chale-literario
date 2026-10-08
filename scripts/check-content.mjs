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

if (/5500000000000|wa\.me\/550+(?!\d)/.test(html)) fail('WhatsApp placeholder 5500000000000 no HTML')
if (/5500000000000/.test(JSON.stringify(config))) fail('site.config.json ainda com o placeholder 5500000000000')
if (!html.includes(`wa.me/${String(config.whatsappNumber).replace(/\D/g, '')}?text=`)) {
  fail('links wa.me sem o número do site.config.json ou sem mensagem pronta')
}
if (html.includes('config-notice')) fail('aviso de número de exemplo ainda aparece')
if (!/\(\d{2}\) \d{4,5}-\d{4}/.test(html)) fail('número de WhatsApp visível ausente, formato (51) 99202-2580')

const labelDigits = String(config.priceLabel).replace(/\D/g, '')
if (!labelDigits.includes(String(config.priceAmount))) {
  fail('priceLabel e priceAmount divergem em site.config.json')
}

const banned = [
  '182.000', '182000', 'R$ 182', '182 mil', '149.900', '149900', '680 Ah',
  'refletivo térmico', 'anti-ruído', '5500000000000',
  // fatos ainda não confirmados pelo Dan (ver CONTENT.md)
  'MDF', 'PU 55', 'ucalipto', 'PU náutico', 'onversível', 'km por dia', 'anti-impacto',
  // nada de prometer financiamento
  'inanciamento', 'inanciar', 'inanciável',
  // saídas externas
  'gov.br', 'google.com/maps', 'maps.google', 'Abrir Anitápolis no Google Maps', '<iframe',
  // redação negativa / repetição cortada na auditoria
  'linda estante', 'não marcamos', 'mais embaixo', 'Chamar no WhatsApp',
  // sem custo de construção / investimento do dono (decisão do Dan, out/2026)
  'Investimento do dono', 'nvestimento', 'nvesti', 'R$ 100 mil', '100 mil', 'R$ 100.000', '100.000',
  'mão de obra', 'meses de obra', 'do zero', 'custo para montar', 'custo de reproduzir',
]
for (const term of banned) {
  if (html.includes(term)) fail(`termo bloqueado encontrado no HTML: ${term}`)
}

// Texto visível (sem tags, scripts e estilos) + atributos que aparecem para a pessoa
const visible = html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<head[\s\S]*?<\/head>/i, ' ')
  .replace(/<[^>]+>/g, ' ')
const visibleAttrs = [...html.matchAll(/\s(?:alt|title|aria-label|placeholder|data-caption|data-alt)="([^"]*)"/gi)]
  .map((m) => m[1])
  .join(' ')
if (/placeholder/i.test(visible) || /placeholder/i.test(visibleAttrs)) {
  fail('a palavra "placeholder" aparece no texto visível do HTML')
}
if (/\bDan\b/.test(visible) || /\bDan\b/.test(visibleAttrs)) {
  fail('o nome do dono aparece na página; use "o dono"/"eu" até ele confirmar')
}
if (/<form\b/i.test(html) || /\srequired\b/i.test(html)) fail('formulário obrigatório antes do WhatsApp')

for (const phrase of [
  'Uma cabana aconchegante',
  'Anitápolis',
  'motor refeito aos 550 mil km',
  'FIPE até R$ 50 mil',
  'Independência energética e de água',
  'Documentada como motorcasa',
  'sem dívidas',
  'Revisada',
  'Pronta para viajar pela América Latina',
  'em motorhome da América Latina (até onde sei)',
  './mapa/anitapolis.webp',
  'colaboradores do OpenStreetMap',
  '210 L',
  'quebra-onda',
  'Isolamento triplo: massa antirruído + manta térmica + 3TC',
  'Freedom DF4001 240 Ah (720 Ah no total)',
  'aquecedor Lorenzetti a gás com misturador',
  'Aquecedor Lorenzetti a gás (GLP) com misturador',
  'LZ 750BP',
  'Inversor 220 V',
  'Resfriar 67 L 12/24 V',
  'Respondo em até 2 h',
  'Anúncio oficial único',
  'nunca peço sinal',
  'R$ 169.900',
  'Receba fotos e o tour em vídeo no WhatsApp',
]) {
  if (!html.includes(phrase)) fail(`texto obrigatório ausente: ${phrase}`)
}

// WhatsApp: todo link vai para o número real, com mensagem pronta
const number = String(config.whatsappNumber).replace(/\D/g, '')
const waLinks = [...html.matchAll(/href="([^"]*(?:wa\.me|whatsapp)[^"]*)"/gi)].map((m) => m[1])
if (waLinks.length < 8) fail(`poucos links de WhatsApp (${waLinks.length})`)
for (const href of waLinks) {
  if (!href.startsWith(`https://wa.me/${number}?text=`)) fail(`link de WhatsApp fora do padrão: ${href}`)
}
for (const [intent, label] of [
  ['video', 'Quero ver por vídeo'],
  ['troca', 'Tenho carro para troca'],
  ['duvida', 'Tenho uma dúvida'],
]) {
  const re = new RegExp(`<a[^>]*href="https://wa\\.me/${number}\\?text=([^"]+)"[^>]*data-intent="${intent}"[^>]*>[\\s\\S]*?${label}`)
  const m = html.match(re)
  if (!m) fail(`botão de intenção ausente: ${label}`)
  else if (!decodeURIComponent(m[1]).startsWith('Oi!')) fail(`mensagem pronta estranha em ${label}`)
}
const intentTexts = new Set(
  [...html.matchAll(/href="https:\/\/wa\.me\/\d+\?text=([^"]+)"[^>]*data-intent=/g)].map((m) => m[1]),
)
if (intentTexts.size !== 3) fail('os 3 botões de intenção precisam de mensagens diferentes')

// Saídas: nenhum link para fora, exceto o WhatsApp
const outbound = [...html.matchAll(/<a\b[^>]*href="(https?:[^"]+)"/gi)]
  .map((m) => m[1])
  .filter((href) => !href.startsWith('https://wa.me/'))
if (outbound.length) fail(`links de saída na página: ${outbound.join(', ')}`)
const navLinks = (html.match(/<nav[\s\S]*?<\/nav>/)?.[0].match(/<a\b/g) || []).length
if (navLinks !== 3) fail(`o menu deve ter 3 itens (tem ${navLinks})`)
if (!html.includes('class="dock"')) fail('barra fixa de WhatsApp ausente')

if (!html.includes('src="./assets/') || !html.includes('href="./favicon.svg"')) {
  fail('os assets precisam de caminho relativo (base ./) para GitHub Pages')
}
if (/src="\/assets\/|href="\/assets\//.test(html)) {
  fail('caminho absoluto /assets quebra a página num repositório GitHub Pages')
}

// <img> só para imagens do fabricante (./equipamentos/) e a foto do dono (./media/, se configurada).
// Fotos reais da van entram por src/media-slots.js.
const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0])
for (const tag of imgs) {
  const src = tag.match(/\ssrc="([^"]+)"/)?.[1] || ''
  if (!/^\.\/(equipamentos|media|mapa)\//.test(src)) fail(`<img> fora de ./equipamentos/, ./media/ ou ./mapa/: ${src || tag}`)
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

// Galeria: desligada (showGallery false) => nenhum slot na página.
// Ligada => todos os slots na página e todos com arquivo real.
const slotsInHtml = [...html.matchAll(/data-slot="([^"]+)"/g)].map((match) => match[1])
if (config.showGallery === true) {
  for (const [key, src] of Object.entries(mediaSlots)) {
    if (!slotsInHtml.includes(key)) fail(`slot "${key}" sem elemento na página`)
    if (src == null) fail(`galeria ligada, mas o slot "${key}" está sem foto (src/media-slots.js)`)
  }
  for (const slot of slotsInHtml) {
    if (!(slot in mediaSlots)) fail(`data-slot desconhecido: ${slot}`)
  }
} else if (slotsInHtml.length) {
  fail(`galeria desligada, mas há slots na página: ${slotsInHtml.join(', ')}`)
}
if (config.ownerPhoto && !html.includes('class="owner-photo"')) fail('ownerPhoto configurada, mas a foto não entrou')
if (!config.ownerPhoto && html.includes('owner-photo')) fail('foto do dono na página sem ownerPhoto configurada')

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
