// Gera, na hora do build, o HTML da galeria (tour de fotos) e do catálogo
// a partir de src/data/gallery.json e src/data/inventory.json.
// Foto real entra só salvando o arquivo com o nome do JSON em public/media/...
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const EXTS = ['.jpg', '.jpeg', '.webp', '.png', '.avif']

export function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'))
}

// Procura public/media/<dir>/<nome>.(jpg|jpeg|webp|png|avif) e devolve o caminho relativo à página.
export function findMedia(dir, file) {
  if (!file) return null
  const base = file.replace(/\.[a-z0-9]+$/i, '')
  const candidates = [file, ...EXTS.map((ext) => base + ext)]
  for (const name of candidates) {
    if (fs.existsSync(path.join(root, 'public', 'media', dir, name))) return `./media/${dir}/${name}`
  }
  return null
}

const icon = (name, cls = 'icon') => `<svg class="${cls}" aria-hidden="true"><use href="#icon-${esc(name)}" /></svg>`

function frame(label, iconName, { compact = false } = {}) {
  const text = compact ? '' : `<span class="frame-label">${esc(label)}</span>`
  return `<span class="frame${compact ? ' frame--compact' : ''}" role="img" aria-label="${esc(label)} · foto em breve">${icon(iconName, 'icon frame-icon')}${text}<span class="frame-tag">foto em breve</span></span>`
}

function photo(src, alt, eager = false) {
  return `<img src="${src}" alt="${esc(alt)}" width="1600" height="1200" loading="${eager ? 'eager' : 'lazy'}" decoding="async" />`
}

export function loadGallery() {
  const data = readJson('src/data/gallery.json')
  const slots = []
  data.rooms.forEach((room) => {
    room.slots.forEach((slot) => {
      slot.src = findMedia('fotos', slot.file)
      slot.room = room
      slots.push(slot)
    })
  })
  return { ...data, slots }
}

function tile(slot, { eager = false, extraClass = '' } = {}) {
  const room = slot.room
  const inner = slot.src ? photo(slot.src, slot.alt, eager) : frame(slot.label, room.icon)
  return `<button type="button" class="tile${slot.src ? ' tile--photo' : ''}${extraClass ? ' ' + extraClass : ''}" data-lb="${esc(slot.id)}" data-room="${esc(room.name)}" data-label="${esc(slot.label)}" style="--hue:${Number(room.hue) || 28}" aria-label="Ampliar: ${esc(slot.label)}">${inner}</button>`
}

export function renderMosaic(gallery) {
  const byId = new Map(gallery.slots.map((s) => [s.id, s]))
  const featured = gallery.featured.map((id) => byId.get(id)).filter(Boolean)
  const items = featured
    .map((slot, i) => `<li class="mosaic-item mosaic-item--${i + 1}" data-index="${i}">${tile(slot)}</li>`)
    .join('\n              ')
  const dots = featured
    .map((_, i) => `<button type="button" class="dot${i === 0 ? ' is-active' : ''}" data-dot="${i}" aria-label="Foto ${i + 1} de ${featured.length}"></button>`)
    .join('')
  return `<div class="mosaic" data-carousel>
            <ul class="mosaic-track" role="list">
              ${items}
            </ul>
            <a class="btn mosaic-all" href="#tour" data-tour-open>${icon('grid')} Ver todas as fotos <span class="mosaic-count">(${gallery.slots.length})</span></a>
          </div>
          <div class="dots" aria-label="Fotos em destaque">${dots}</div>`
}

export function renderTour(gallery) {
  const chips = gallery.rooms
    .map((room) => {
      const first = room.slots[0]
      const thumb = first.src
        ? `<img class="chip-img" src="${first.src}" alt="" width="64" height="64" loading="lazy" decoding="async" />`
        : icon(room.icon)
      return `<a class="chip" href="#tour-${esc(room.id)}" data-chip="${esc(room.id)}" style="--hue:${Number(room.hue) || 28}"><span class="chip-thumb">${thumb}</span><span class="chip-name">${esc(room.name)}</span></a>`
    })
    .join('\n          ')
  const rooms = gallery.rooms
    .map((room, i) => {
      const tiles = room.slots.map((slot) => tile(slot)).join('\n              ')
      const n = room.slots.length
      return `<section class="room" id="tour-${esc(room.id)}" data-room-id="${esc(room.id)}" aria-labelledby="room-${esc(room.id)}">
            <div class="room-head">
              <p class="room-kicker">${icon(room.icon)} ${i + 1} de ${gallery.rooms.length} · ${n} ${n === 1 ? 'foto' : 'fotos'}</p>
              <h3 id="room-${esc(room.id)}">${esc(room.name)}</h3>
              <p class="room-caption">${esc(room.caption)}</p>
            </div>
            <div class="room-grid room-grid--${Math.min(n, 6)}">
              ${tiles}
            </div>
          </section>`
    })
    .join('\n          ')
  return { chips, rooms }
}

export function loadInventory() {
  const data = readJson('src/data/inventory.json')
  data.categories.forEach((cat) => cat.items.forEach((item) => (item.src = findMedia('inventario', item.file))))
  return data
}

export function renderInventory(inv) {
  const chips = inv.categories
    .map((cat) => `<a class="chip chip--cat" href="#cat-${esc(cat.id)}" data-chip="${esc(cat.id)}">${icon(cat.icon)}<span class="chip-name">${esc(cat.name)}</span><span class="chip-count">${cat.items.length}</span></a>`)
    .join('\n          ')
  const sections = inv.categories
    .map((cat) => {
      const cards = cat.items
        .map((item) => {
          let media
          let note = ''
          if (item.src) {
            media = photo(item.src, `${item.name}: foto do item instalado`)
          } else if (item.image) {
            media = `<img src="${esc(item.image)}" alt="${esc(item.imageAlt || item.name)}" width="800" height="800" loading="lazy" decoding="async" />`
            note = '<p class="inv-note">Foto ilustrativa do modelo instalado</p>'
          } else {
            media = frame(item.name, item.icon || cat.icon, { compact: true })
          }
          return `<li class="inv-card" id="item-${esc(item.id)}">
                <div class="inv-media${item.src ? ' inv-media--photo' : item.image ? ' inv-media--maker' : ''}">${media}</div>
                <div class="inv-body">
                  ${note}
                  <h3 class="inv-name">${esc(item.name)}</h3>
                  <p class="inv-spec">${esc(item.spec)}</p>
                  <p class="inv-benefit">${esc(item.benefit)}</p>
                </div>
              </li>`
        })
        .join('\n              ')
      return `<section class="cat" id="cat-${esc(cat.id)}" data-room-id="${esc(cat.id)}" aria-labelledby="cat-${esc(cat.id)}-titulo">
            <header class="cat-head">
              <span class="cat-icon">${icon(cat.icon)}</span>
              <div>
                <h2 id="cat-${esc(cat.id)}-titulo">${esc(cat.name)}</h2>
                <p>${esc(cat.intro)}</p>
              </div>
            </header>
            <ul class="inv-grid" role="list">
              ${cards}
            </ul>
          </section>`
    })
    .join('\n          ')
  const total = inv.categories.reduce((n, cat) => n + cat.items.length, 0)
  return { chips, sections, total }
}

// Tamanho real da imagem (JPEG, PNG, WebP), para width/height corretos na foto do topo.
export function imageSize(file) {
  try {
    const b = fs.readFileSync(file)
    if (b[0] === 0x89 && b.toString('ascii', 1, 4) === 'PNG') return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }
    if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
      const kind = b.toString('ascii', 12, 16)
      if (kind === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) }
      if (kind === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff }
      if (kind === 'VP8L') {
        const n = b.readUInt32LE(21)
        return { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 }
      }
    }
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2
      while (i < b.length) {
        if (b[i] !== 0xff) { i++; continue }
        const marker = b[i + 1]
        const len = b.readUInt16BE(i + 2)
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) }
        }
        i += 2 + len
      }
    }
  } catch {}
  return null
}

// Foto do topo (hero). Arquivo: public/media/fotos/hero-estante.* ; versões menores opcionais
// hero-estante-640.*, -960.*, -1280.* viram srcset. Sem arquivo, usa a foto da galeria
// "estante-fim-de-tarde" se existir; senão, o card "foto em breve".
export const HERO_SIZES = '(min-width: 1152px) 563px, (min-width: 900px) calc(52.5vw - 42px), calc(100vw - 2rem)'

export function heroImage(gallery) {
  const hero = gallery.hero
  if (!hero) return null
  let src = findMedia('fotos', hero.file)
  let base = hero.file.replace(/\.[a-z0-9]+$/i, '')
  if (!src) {
    const fallback = gallery.rooms.flatMap((r) => r.slots).find((s) => s.id === 'estante-fim-de-tarde')
    if (fallback) {
      src = findMedia('fotos', fallback.file)
      base = fallback.file.replace(/\.[a-z0-9]+$/i, '')
    }
  }
  if (!src) return { hero, src: null }
  const size = imageSize(path.join(root, 'public', src.slice(2))) || { w: 1600, h: 1200 }
  const variants = []
  for (const w of [640, 960, 1280]) {
    const v = findMedia('fotos', `${base}-${w}.jpg`)
    if (v) variants.push(`${v} ${w}w`)
  }
  const srcset = variants.length ? [...variants, `${src} ${size.w}w`].join(', ') : ''
  return { hero, src, size, srcset }
}

export function renderHero(gallery) {
  const img = heroImage(gallery)
  if (!img) return { media: '', preload: '' }
  const { hero } = img
  if (!img.src) {
    return {
      media: `<figure class="hero-media" style="--hue:${Number(hero.hue) || 28}">${frame(hero.label, hero.icon || 'book')}</figure>`,
      preload: '',
    }
  }
  const srcsetAttr = img.srcset ? ` srcset="${img.srcset}" sizes="${HERO_SIZES}"` : ` sizes="${HERO_SIZES}"`
  return {
    media: `<figure class="hero-media hero-media--photo"><img class="hero-img" src="${img.src}"${srcsetAttr} alt="${esc(hero.alt)}" width="${img.size.w}" height="${img.size.h}" loading="eager" fetchpriority="high" /></figure>`,
    preload: `<link rel="preload" as="image" href="${img.src}"${img.srcset ? ` imagesrcset="${img.srcset}" imagesizes="${HERO_SIZES}"` : ''} fetchpriority="high" />`,
  }
}

export function renderBlocks(html) {
  if (html.includes('<!--partial:sprite-->')) {
    html = html.replace('<!--partial:sprite-->', fs.readFileSync(path.join(root, 'src/partials/sprite.svg'), 'utf8').trim())
  }
  if (/<!--hero:/.test(html)) {
    const hero = renderHero(loadGallery())
    html = html.replace('<!--hero:preload-->', hero.preload).replace('<!--hero:media-->', hero.media)
  }
  if (/<!--gallery:/.test(html)) {
    const gallery = loadGallery()
    const tour = renderTour(gallery)
    html = html
      .replace('<!--gallery:mosaic-->', renderMosaic(gallery))
      .replace('<!--gallery:chips-->', tour.chips)
      .replace('<!--gallery:rooms-->', tour.rooms)
      .replaceAll('<!--gallery:count-->', String(gallery.slots.length))
  }
  if (/<!--inventory:/.test(html)) {
    const inv = renderInventory(loadInventory())
    html = html
      .replace('<!--inventory:chips-->', inv.chips)
      .replace('<!--inventory:sections-->', inv.sections)
      .replaceAll('<!--inventory:count-->', String(inv.total))
  }
  return html
}
