// Confere as duas páginas geradas (dist/index.html e dist/catalogo.html) antes de publicar.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const config = JSON.parse(fs.readFileSync(path.join(project, 'site.config.json'), 'utf8'))
const gallery = JSON.parse(fs.readFileSync(path.join(project, 'src/data/gallery.json'), 'utf8'))
const inventory = JSON.parse(fs.readFileSync(path.join(project, 'src/data/inventory.json'), 'utf8'))
const number = String(config.whatsappNumber).replace(/\D/g, '')
const siteUrl = String(config.siteUrl || '').replace(/\/?$/, '/')
if (siteUrl !== 'https://vistasobrerodas.com.br/chale-literario/') {
  fail(`siteUrl deve ser https://vistasobrerodas.com.br/chale-literario/ (tem "${siteUrl}")`)
}

let page = ''
function fail(message) {
  console.error(`check-content${page ? ` [${page}]` : ''}: ${message}`)
  process.exitCode = 1
}

function read(name) {
  const file = path.join(project, 'dist', name)
  if (!fs.existsSync(file)) {
    fail(`dist/${name} não existe (faltou a página no build multi-página?)`)
    return ''
  }
  return fs.readFileSync(file, 'utf8')
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
  // URL antiga do GitHub Pages (domínio novo: vistasobrerodas.com.br/chale-literario)
  'danilosilvadev.github.io/motorhome-venda', 'github.io/motorhome-venda',
]

// ---------- regras comuns às duas páginas ----------
function commonChecks(html, { minWa }) {
  const leftovers = html.match(/__[A-Z0-9_]+__/g)
  if (leftovers) fail(`tokens não substituídos: ${[...new Set(leftovers)].join(', ')}`)
  if (/<!--(gallery|inventory|partial|hero):/.test(html)) fail('bloco gerado não substituído (<!--gallery:/inventory:/partial:-->)')
  if (!html.includes('id="icon-wa"')) fail('sprite de ícones ausente')
  if (!html.includes(config.priceLabel)) fail(`preço "${config.priceLabel}" ausente`)
  if (html.includes('config-notice')) fail('aviso de número de exemplo ainda aparece')
  if (!/\(\d{2}\) \d{4,5}-\d{4}/.test(html)) fail('número de WhatsApp visível ausente, formato (51) 99202-2580')

  for (const term of banned) {
    if (html.includes(term)) fail(`termo bloqueado: ${term}`)
  }
  if (/vistasobrerodas\.com(?!\.br)/.test(html)) fail('domínio errado: use vistasobrerodas.com.br (o .com não existe)')

  const visible = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<head[\s\S]*?<\/head>/i, ' ')
    .replace(/<[^>]+>/g, ' ')
  const attrs = [...html.matchAll(/\s(?:alt|title|aria-label|placeholder|data-caption|data-alt|data-label|data-room)="([^"]*)"/gi)]
    .map((m) => m[1])
    .join(' ')
  if (/placeholder/i.test(visible) || /placeholder/i.test(attrs)) fail('a palavra "placeholder" aparece no texto visível ou em alt/aria-label')
  if (/\bDan\b/.test(visible) || /\bDan\b/.test(attrs)) fail('o nome do dono aparece; use "o dono"/"eu" até ele confirmar')
  if (/<form\b/i.test(html) || /\srequired\b/i.test(html)) fail('formulário antes do WhatsApp')
  if (/<video\b/i.test(html)) fail('<video> fixo no HTML')
  if (/unsplash|pexels|shutterstock|picsum|placeholder\.com/i.test(html)) fail('referência a banco de imagens')

  // WhatsApp: todo link vai para o número real, com mensagem pronta
  const waLinks = [...html.matchAll(/href="([^"]*(?:wa\.me|whatsapp|api\.whats)[^"]*)"/gi)].map((m) => m[1])
  if (waLinks.length < minWa) fail(`poucos links de WhatsApp (${waLinks.length})`)
  for (const href of waLinks) {
    if (!href.startsWith(`https://wa.me/${number}?text=`)) fail(`link de WhatsApp fora do padrão: ${href}`)
    else if (!decodeURIComponent(href.split('?text=')[1]).startsWith('Oi!')) fail(`mensagem pronta estranha: ${href}`)
  }

  // Saídas: só WhatsApp para fora; por dentro, âncoras da página, a landing e o catálogo
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
  for (const [, href] of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/gi)) {
    if (href.startsWith('https://wa.me/')) continue
    if (/^https?:|^\/\/|^mailto:|^tel:/i.test(href)) fail(`link de saída: ${href}`)
    else if (href.startsWith('#')) {
      if (href.length > 1 && !ids.has(href.slice(1))) fail(`âncora sem destino: ${href}`)
    } else if (!/^\.\/(index\.html|catalogo\.html(#[\w-]+)?)?$/.test(href)) fail(`link interno inesperado: ${href}`)
  }

  if (!html.includes('class="dock"')) fail('barra fixa de WhatsApp ausente')
  if (!html.includes('src="./assets/') || !html.includes('href="./favicon.svg"')) fail('assets sem caminho relativo (base ./)')
  if (/src="\/assets\/|href="\/assets\//.test(html)) fail('caminho absoluto /assets quebra o GitHub Pages')

  for (const [tag] of html.matchAll(/<img\b[^>]*>/gi)) {
    const src = tag.match(/\ssrc="([^"]+)"/)?.[1] || ''
    if (!/^\.\/(equipamentos|media|mapa)\//.test(src)) fail(`<img> fora de ./equipamentos/, ./media/ ou ./mapa/: ${src || tag}`)
    else if (!fs.existsSync(path.join(project, 'public', src.slice(2)))) fail(`imagem ausente: ${src}`)
    if (!/\sloading="(lazy|eager)"/.test(tag)) fail(`<img> sem loading: ${src}`)
    if (!/\salt="[^"]+"/.test(tag) && !/class="chip-img"/.test(tag)) fail(`<img> sem alt: ${src}`)
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) fail(`<img> sem width/height: ${src}`)
  }

  const navLinks = (html.match(/<nav\b[^>]*class="nav-panel[\s\S]*?<\/nav>/)?.[0].match(/<a\b/g) || []).length
  if (navLinks < 1 || navLinks > 3) fail(`menu curto: 1 a 3 itens (tem ${navLinks})`)
  return { visible }
}

// ---------- dados (galeria e inventário) ----------
page = 'dados'
const fileRe = /^[a-z0-9-]+\.(jpg|jpeg|png|webp)$/
const roomNames = ['A cabana e a estante', 'Quarto com vista', 'Cozinha', 'Banheiro naval', 'Energia e água', 'Cabine e motor', 'Por fora']
const roomsGot = gallery.rooms.map((r) => r.name)
if (JSON.stringify(roomsGot) !== JSON.stringify(roomNames)) fail(`cômodos da galeria: ${roomsGot.join(' | ')}`)
const slotIds = new Set()
const slotFiles = new Set()
let slotTotal = 0
for (const room of gallery.rooms) {
  if (!room.caption) fail(`cômodo sem legenda: ${room.name}`)
  if (room.slots.length < 2 || room.slots.length > 6) fail(`${room.name}: ${room.slots.length} fotos (use 2 a 6)`)
  for (const slot of room.slots) {
    slotTotal++
    if (slotIds.has(slot.id)) fail(`slot repetido: ${slot.id}`)
    if (slotFiles.has(slot.file)) fail(`arquivo repetido: ${slot.file}`)
    slotIds.add(slot.id)
    slotFiles.add(slot.file)
    if (!fileRe.test(slot.file)) fail(`nome de arquivo inválido: ${slot.file}`)
    if (!slot.label || !slot.alt) fail(`slot sem legenda/alt: ${slot.id}`)
  }
}
if (gallery.featured.length !== 5 || gallery.featured.some((id) => !slotIds.has(id))) fail('featured precisa de 5 slots existentes')
const catNames = ['Estrutura e isolamento', 'Energia', 'Água', 'Cozinha e conforto', 'Quarto e estante', 'Banheiro', 'Veículo e documentação']
const catsGot = inventory.categories.map((c) => c.name)
if (JSON.stringify(catsGot) !== JSON.stringify(catNames)) fail(`categorias do catálogo: ${catsGot.join(' | ')}`)
const itemIds = new Set()
let itemTotal = 0
let makerTotal = 0
for (const cat of inventory.categories) {
  for (const item of cat.items) {
    itemTotal++
    if (itemIds.has(item.id)) fail(`item repetido: ${item.id}`)
    itemIds.add(item.id)
    if (!fileRe.test(item.file)) fail(`nome de arquivo inválido: ${item.file}`)
    if (!item.name || !item.spec || !item.benefit) fail(`item incompleto: ${item.id}`)
    if (item.image) {
      makerTotal++
      if (!fs.existsSync(path.join(project, 'public', item.image.slice(2)))) fail(`imagem do fabricante ausente: ${item.image}`)
    }
  }
}

// ---------- landing ----------
page = 'index.html'
const html = read('index.html')
if (html) {
  const { visible } = commonChecks(html, { minWa: 8 })
  if (!html.includes(String(config.year))) fail('ano ausente')
  if (!html.includes(config.kilometersLabel)) fail('quilometragem ausente')
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
    'Ver catálogo completo e inventário',
  ]) {
    if (!html.includes(phrase)) fail(`texto obrigatório ausente: ${phrase}`)
  }

  for (const [intent, label] of [
    ['video', 'Quero ver por vídeo'],
    ['troca', 'Tenho carro para troca'],
    ['duvida', 'Tenho uma dúvida'],
  ]) {
    const re = new RegExp(`<a[^>]*href="https://wa\\.me/${number}\\?text=([^"]+)"[^>]*data-intent="${intent}"[^>]*>[\\s\\S]*?${label}`)
    if (!re.test(html)) fail(`botão de intenção ausente: ${label}`)
  }
  const intentTexts = new Set([...html.matchAll(/href="https:\/\/wa\.me\/\d+\?text=([^"]+)"[^>]*data-intent=/g)].map((m) => m[1]))
  if (intentTexts.size !== 3) fail('os 3 botões de intenção precisam de mensagens diferentes')

  // Hero: emoção primeiro, preço logo depois (ordem aprovada pelo Dan)
  const hero = html.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0] || ''
  const order = [
    ['linha do modelo', 'class="disclosure"'],
    ['título', '<h1'],
    ['foto do topo', 'class="hero-media'],
    ['frase da estante', 'class="hero-sub"'],
    ['preço', 'class="price"'],
    ['troca FIPE', 'class="price-trade"'],
    ['botão do WhatsApp', 'data-wa="padrao"'],
    ['microcopy', 'Respondo em até 2 h'],
  ]
  let last = -1
  for (const [name, needle] of order) {
    const at = hero.indexOf(needle)
    if (at < 0) fail(`hero sem ${name}`)
    else if (at < last) fail(`hero fora de ordem: ${name} veio antes do item anterior`)
    else last = at
  }
  if ((hero.match(/class="btn [^"]*btn--wa/g) || []).length !== 1) fail('hero precisa de exatamente 1 botão de WhatsApp')
  const heroImg = hero.match(/<img class="hero-img"[^>]*>/)?.[0]
  if (heroImg) {
    if (!/loading="eager"/.test(heroImg) || !/fetchpriority="high"/.test(heroImg) || !/\ssizes="/.test(heroImg)) {
      fail('foto do topo precisa de loading="eager", fetchpriority="high" e sizes (é o LCP)')
    }
    if (!/<link rel="preload" as="image"[^>]*fetchpriority="high"/.test(html)) fail('foto do topo sem preload')
    if ((html.match(/fetchpriority="high"/g) || []).length > 2) fail('só a foto do topo pode ter fetchpriority="high"')
  } else if (!/class="hero-media"[^>]*>\s*<span class="frame"[\s\S]*?foto em breve/.test(hero)) {
    fail('sem foto do topo, o hero precisa do card "foto em breve"')
  }
  const loadingEager = (html.match(/loading="eager"/g) || []).length
  if (loadingEager > (heroImg ? 1 : 0)) fail('loading="eager" só na foto do topo')

  // catálogo: botão na galeria e na Ficha
  const catLinks = (html.match(/href="\.\/catalogo\.html"/g) || []).length
  if (catLinks < 3) fail(`poucos links para o catálogo (${catLinks}); precisa na galeria, no tour e na Ficha`)
  const ficha = html.match(/<section class="section" id="ficha"[\s\S]*?<\/section>/)?.[0] || ''
  if (!ficha.includes('href="./catalogo.html"')) fail('Ficha/Equipamentos sem botão para o catálogo')

  if (config.showGallery === true) {
    const fotos = html.match(/<section[^>]*id="fotos"[\s\S]*?<\/section>/)?.[0] || ''
    if (!fotos.includes('href="./catalogo.html"')) fail('galeria sem botão para o catálogo')
    if (!fotos.includes('href="#tour"')) fail('galeria sem "Ver todas as fotos"')
    const mosaicItems = (html.match(/class="mosaic-item /g) || []).length
    if (mosaicItems !== 5) fail(`mosaico com ${mosaicItems} fotos (precisa de 5)`)
    const tour = html.match(/<section class="tour"[\s\S]*?<\/section>\s*<\/main>/)?.[0] || ''
    if (!tour) fail('tour de fotos ausente')
    const tourTiles = [...tour.matchAll(/class="tile[^"]*" data-lb="([^"]+)"/g)].map((m) => m[1])
    if (tourTiles.length !== slotTotal) fail(`tour com ${tourTiles.length} fotos, dados têm ${slotTotal}`)
    for (const room of roomNames) if (!tour.includes(`>${room}</h3>`)) fail(`cômodo ausente no tour: ${room}`)
    const chips = (tour.match(/class="chip" href="#tour-/g) || []).length
    if (chips !== roomNames.length) fail(`chips de cômodo: ${chips}`)
    const mosaicIds = [...html.matchAll(/class="mosaic-item[\s\S]*?data-lb="([^"]+)"/g)].map((m) => m[1])
    for (const id of mosaicIds) if (!tourTiles.includes(id)) fail(`foto do mosaico fora do tour: ${id}`)
    const missing = gallery.rooms.flatMap((r) => r.slots).some((s) => !html.includes(`./media/fotos/${s.file.replace(/\.[a-z]+$/, '')}`))
    if (missing && !visible.includes('foto em breve')) fail('slots sem foto precisam do selo "foto em breve"')
  } else if (!html.includes('Receba fotos e o tour em vídeo no WhatsApp')) {
    fail('galeria desligada sem o bloco "Receba fotos e o tour em vídeo no WhatsApp"')
  }

  if (!html.includes('id="equipamentos"')) fail('Equipamentos ausente')
  if (!html.includes('Foto ilustrativa do modelo instalado')) fail('legenda "Foto ilustrativa do modelo instalado" ausente')
  const equipCards = (html.match(/class="equip-card[" ]/g) || []).length
  const equipNotes = (html.match(/class="equip-note"/g) || []).length
  if (equipCards < 9 || equipNotes !== equipCards) fail(`Equipamentos: ${equipCards} cards e ${equipNotes} legendas`)

  if (config.ownerPhoto && !html.includes('class="owner-photo"')) fail('ownerPhoto configurada, mas a foto não entrou')
  if (!config.ownerPhoto && html.includes('owner-photo')) fail('foto do dono sem ownerPhoto configurada')

  const jsonMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  if (!jsonMatch) fail('JSON-LD ausente')
  else {
    const data = JSON.parse(jsonMatch[1])
    if (String(data.offers?.price) !== String(config.priceAmount)) fail('JSON-LD com preço diferente de site.config.json')
    if (String(data.vehicleModelDate) !== String(config.year)) fail('JSON-LD com ano divergente')
    if (data.url !== siteUrl) fail(`JSON-LD url deve ser ${siteUrl}`)
    if (data.offers?.url !== siteUrl) fail(`JSON-LD offers.url deve ser ${siteUrl}`)
  }
  if (!html.includes(`rel="canonical" href="${siteUrl}"`)) fail(`canonical ausente ou diferente de ${siteUrl}`)
  if (!html.includes(`property="og:url" content="${siteUrl}"`)) fail(`og:url ausente ou diferente de ${siteUrl}`)
}

// ---------- catálogo ----------
page = 'catalogo.html'
const cat = read('catalogo.html')
if (cat) {
  commonChecks(cat, { minWa: 4 })
  for (const phrase of ['Catálogo completo e inventário', 'Foto ilustrativa do modelo instalado', 'Freedom DF4001', 'Resfriar 67 L 12/24 V', 'Lorenzetti', 'Isolamento triplo', '210 L', 'quebra-onda', '720 Ah', 'FIPE até R$ 50 mil', 'Respondo em até 2 h']) {
    if (!cat.includes(phrase)) fail(`texto obrigatório ausente: ${phrase}`)
  }
  if (!/href="https:\/\/wa\.me\/\d+\?text=Oi!%20Vi%20o%20cat%C3%A1logo/.test(cat)) fail('WhatsApp do catálogo sem a mensagem "Vi o catálogo…"')
  if (!/<a [^>]*href="\.\/"/.test(cat)) fail('link de volta para o anúncio ausente')
  if (!cat.includes(`rel="canonical" href="${siteUrl}catalogo.html"`)) fail('canonical do catálogo ausente')
  if (!cat.includes(`property="og:url" content="${siteUrl}catalogo.html"`)) fail('og:url do catálogo ausente')
  const cards = (cat.match(/class="inv-card"/g) || []).length
  if (cards !== itemTotal) fail(`catálogo com ${cards} itens, dados têm ${itemTotal}`)
  for (const name of catNames) if (!cat.includes(`>${name}</h2>`)) fail(`categoria ausente: ${name}`)
  const chips = (cat.match(/class="chip chip--cat"/g) || []).length
  if (chips !== catNames.length) fail(`chips de categoria: ${chips}`)
  const makerImgs = (cat.match(/<img src="\.\/equipamentos\//g) || []).length
  const makerNotes = (cat.match(/class="inv-note"/g) || []).length
  if (makerImgs < 3 || makerImgs !== makerNotes || makerImgs > makerTotal) fail(`imagens do fabricante ${makerImgs}, legendas ${makerNotes}`)
}

page = 'css'
const style = fs.readFileSync(path.join(project, 'src', 'style.css'), 'utf8')
for (const url of style.match(/url\(([^)]+)\)/g) || []) {
  if (!url.includes('data:')) fail(`CSS com url que não é data URI: ${url}`)
}

if (process.exitCode) process.exit(process.exitCode)
console.log(`check-content: landing + catálogo conferidos (${slotTotal} fotos no tour, ${itemTotal} itens no inventário).`)
