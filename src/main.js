import '@fontsource/fraunces/latin-400.css'
import '@fontsource/fraunces/latin-400-italic.css'
import '@fontsource/fraunces/latin-600.css'
import '@fontsource/fraunces/latin-600-italic.css'
import '@fontsource/outfit/latin-400.css'
import '@fontsource/outfit/latin-500.css'
import '@fontsource/outfit/latin-600.css'
import './style.css'
import { mediaSlots } from './media-slots.js'

const header = document.querySelector('.site-header')
const toggle = document.querySelector('.nav-toggle')
const menu = document.querySelector('#menu')

function setMenu(open) {
  if (!toggle || !menu) return
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
  menu.classList.toggle('is-open', open)
  document.body.classList.toggle('nav-open', open)
  toggle.querySelector('.nav-toggle-label').textContent = open ? 'Fechar' : 'Menu'
}

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true')
  })

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false))
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false)
  })
}

const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)')
const parallaxOk = window.matchMedia('(prefers-reduced-motion: no-preference) and (min-width: 900px)')
const heroFigure = document.querySelector('.media-slot--hero')
const dock = document.querySelector('.dock')

let ticking = false

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const y = window.scrollY
    header?.classList.toggle('is-scrolled', y > 8)
    dock?.classList.toggle('is-awake', y > 28)
    if (parallaxOk.matches && heroFigure) {
      const drift = Math.min(y, 480) * 0.06
      heroFigure.style.setProperty('--drift', `${drift.toFixed(1)}px`)
    } else if (heroFigure) {
      heroFigure.style.removeProperty('--drift')
    }
    ticking = false
  })
}

onScroll()
document.addEventListener('scroll', onScroll, { passive: true })
parallaxOk.addEventListener?.('change', onScroll)

function setupReveal() {
  if (!motionOk.matches || !('IntersectionObserver' in window)) return

  const phone = window.matchMedia('(max-width: 899px)').matches
  const selector = phone
    ? '.section-head, .facts-list, .truths, .chapters, .gallery, .walkthrough, .sources, .battery, .indep-note, .equip-grid, .equip-foot, .table-wrap, .faq, .places, .map-card, .form-card, .footer-grid'
    : '.section-head, .facts-list > li, .truths > li, .chapter, .gallery .media-slot, .walkthrough, .sources > li, .battery, .indep-note, .equip-grid > li, .equip-foot, .table-wrap, .faq details, .places > li, .map-card, .form-card, .footer-grid > div'
  const nodes = [...document.querySelectorAll(selector)]
  if (!nodes.length) return

  document.documentElement.classList.add('js')
  const groups = new Map()
  nodes.forEach((el) => {
    const key = el.parentElement
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(el)
  })
  const stagger = phone ? 40 : 65
  const staggerCap = phone ? 3 : 5
  groups.forEach((list) => {
    list.forEach((el, index) => {
      el.classList.add('reveal')
      el.style.setProperty('--reveal-delay', `${Math.min(index, staggerCap) * stagger}ms`)
    })
  })

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-in')
        observer.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px 18% 0px', threshold: 0.01 },
  )
  nodes.forEach((el) => observer.observe(el))
}

setupReveal()

function upgradeMedia() {
  document.querySelectorAll('.media-slot').forEach((figure) => {
    const src = mediaSlots[figure.dataset.slot]
    if (!src) return

    const placeholder = figure.querySelector('.media-placeholder')
    if (!placeholder) return

    const caption = figure.dataset.caption || ''
    const alt = figure.dataset.alt || caption || 'Foto do motorhome'
    const resolved = new URL(src, window.location.href).href
    const isVideo = figure.dataset.kind === 'video'
    const media = document.createElement(isVideo ? 'video' : 'img')

    media.className = 'media-frame--photo'
    if (isVideo) {
      media.controls = true
      media.playsInline = true
      media.preload = 'metadata'
      media.setAttribute('aria-label', alt)
      media.src = resolved
    } else {
      media.alt = alt
      media.decoding = 'async'
      media.loading = figure.classList.contains('media-slot--hero') ? 'eager' : 'lazy'
      if (figure.classList.contains('media-slot--hero')) {
        media.setAttribute('fetchpriority', 'high')
      }
      media.src = resolved
    }

    media.addEventListener('error', () => {
      const fallback = document.createElement('div')
      fallback.className = 'media-placeholder media-frame--placeholder'
      fallback.setAttribute('role', 'img')
      const kicker = document.createElement('span')
      kicker.className = 'media-kicker'
      kicker.textContent = 'Placeholder'
      const title = document.createElement('p')
      title.className = 'media-title'
      title.textContent = `${caption || 'Mídia'} — arquivo não encontrado`
      fallback.append(kicker, title)
      media.replaceWith(fallback)
    })

    placeholder.replaceWith(media)
    figure.classList.add('is-ready')

    const cap = figure.querySelector('figcaption')
    if (cap && caption) {
      cap.textContent = caption
      cap.classList.remove('visually-hidden')
    }
  })
}

upgradeMedia()

const form = document.querySelector('#visita-form')
const formError = document.querySelector('#form-error')
const formFallback = document.querySelector('#form-fallback')
const formFallbackLink = document.querySelector('#form-fallback-link')

function clean(value, max) {
  return value.replace(/\s+/g, ' ').trim().slice(0, max)
}

function showFormError(message) {
  if (!formError) return
  formError.hidden = false
  formError.textContent = message
}

function clearFormError() {
  if (!formError) return
  formError.hidden = true
  formError.textContent = ''
}

form?.addEventListener('input', clearFormError)

form?.addEventListener('submit', (event) => {
  event.preventDefault()
  clearFormError()
  formFallback?.setAttribute('hidden', '')

  const nome = clean(form.nome.value, 80)
  const cidade = clean(form.cidade.value, 80)
  const quando = clean(form.quando.value, 80)

  if (!nome || !cidade || !quando) {
    showFormError('Preencha nome, cidade e quando / formato (visita ou videochamada).')
    if (!nome) form.nome.focus()
    else if (!cidade) form.cidade.focus()
    else form.quando.focus()
    return
  }

  const { whatsapp, price, year, km } = document.body.dataset
  if (!whatsapp) {
    showFormError('O WhatsApp deste anúncio ainda não está configurado.')
    return
  }

  const text = [
    `Olá! Vi o motorhome Renault Master ${year} em Anitápolis (preço pedido ${price}).`,
    '',
    `Nome: ${nome}`,
    `Cidade: ${cidade}`,
    `Quando / formato: ${quando}`,
  ].join('\n')

  const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`
  const opened = window.open(url, '_blank', 'noopener,noreferrer')

  if (!opened && formFallback && formFallbackLink) {
    formFallback.hidden = false
    formFallbackLink.href = url
    showFormError('O navegador bloqueou a nova aba. Use o link abaixo para abrir o WhatsApp.')
  }
})
