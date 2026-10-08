import '@fontsource/fraunces/latin-400.css'
import '@fontsource/fraunces/latin-400-italic.css'
import '@fontsource/fraunces/latin-600.css'
import '@fontsource/fraunces/latin-600-italic.css'
import '@fontsource/outfit/latin-400.css'
import '@fontsource/outfit/latin-500.css'
import '@fontsource/outfit/latin-600.css'
import './style.css'
import { setupGallery } from './gallery.js'

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
    ? '.section-head, .facts-grid, .cta-block, .chapters, .gallery-actions, .catalog-callout, .cat-hero, .sources, .battery, .indep-note, .anchor, .spec-groups, .faq, .intent-grid, .trust, .map-card, .footer-grid'
    : '.section-head, .facts-grid > li, .cta-block, .chapter, .gallery-actions, .catalog-callout, .cat-hero, .sources > li, .battery, .indep-note, .anchor > li, .spec-group, .faq details, .intent-grid, .trust, .map-card, .footer-grid > div'
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

setupGallery()

// Origem do clique: ?utm_source=fb vira "(ref: fb)" no fim da mensagem pronta.
function tagWhatsAppLinks() {
  const params = new URLSearchParams(window.location.search)
  const ref = (params.get('utm_source') || params.get('ref') || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 20)
  if (!ref) return
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => {
    const url = new URL(link.href)
    const text = url.searchParams.get('text') || ''
    if (text.includes('(ref:')) return
    url.searchParams.set('text', `${text} (ref: ${ref})`)
    link.href = url.toString()
  })
}

tagWhatsAppLinks()
