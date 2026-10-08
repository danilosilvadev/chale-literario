// Galeria estilo Airbnb: mosaico/carrossel, tour por cômodo, lightbox e scroll-spy.
// Tudo funciona sem animação quando a pessoa pede menos movimento.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const behavior = () => (reduceMotion.matches ? 'auto' : 'smooth')

/* ---------- entrada suave (fade/scale) ---------- */
function popIn(nodes, root = null) {
  if (reduceMotion.matches || !('IntersectionObserver' in window) || !nodes.length) return
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-in')
        io.unobserve(entry.target)
      })
    },
    { root, rootMargin: '0px 0px 10% 0px', threshold: 0.05 },
  )
  nodes.forEach((el, i) => {
    el.classList.add('pop')
    el.style.setProperty('--pop-delay', `${(i % 3) * 60}ms`)
    io.observe(el)
  })
}

/* ---------- carrossel do mosaico (celular) ---------- */
function setupCarousel(root) {
  const track = root.querySelector('.mosaic-track')
  const items = [...root.querySelectorAll('.mosaic-item')]
  const dots = [...document.querySelectorAll('.dots .dot')]
  if (!track || !items.length) return

  const setActive = (index) => {
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index)
      dot.setAttribute('aria-current', i === index ? 'true' : 'false')
    })
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index))
        })
      },
      { root: track, threshold: 0.6 },
    )
    items.forEach((item) => io.observe(item))
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const item = items[Number(dot.dataset.dot)]
      track.scrollTo({ left: item.offsetLeft - track.offsetLeft, behavior: behavior() })
    })
  })
}

/* ---------- lightbox ---------- */
function createLightbox() {
  const box = document.createElement('div')
  box.className = 'lb'
  box.hidden = true
  box.setAttribute('role', 'dialog')
  box.setAttribute('aria-modal', 'true')
  box.setAttribute('aria-label', 'Foto ampliada')
  box.innerHTML = `
    <button type="button" class="lb-btn lb-close" aria-label="Fechar"><svg class="icon" aria-hidden="true"><use href="#icon-close" /></svg></button>
    <button type="button" class="lb-btn lb-prev" aria-label="Foto anterior"><svg class="icon" aria-hidden="true"><use href="#icon-prev" /></svg></button>
    <button type="button" class="lb-btn lb-next" aria-label="Próxima foto"><svg class="icon" aria-hidden="true"><use href="#icon-next" /></svg></button>
    <figure class="lb-stage">
      <div class="lb-media"></div>
      <figcaption class="lb-caption">
        <span class="lb-room"></span>
        <span class="lb-label"></span>
        <span class="lb-count" aria-live="polite"></span>
      </figcaption>
    </figure>`
  document.body.append(box)
  return box
}

function setupLightbox(tiles) {
  if (!tiles.length) return null
  const box = createLightbox()
  const media = box.querySelector('.lb-media')
  const stage = box.querySelector('.lb-stage')
  let index = 0
  let lastFocus = null

  const render = (dir = 0) => {
    const tile = tiles[index]
    const img = tile.querySelector('img')
    let node
    if (img) {
      node = document.createElement('img')
      node.src = img.currentSrc || img.src
      node.alt = img.alt
      node.decoding = 'async'
    } else {
      node = tile.querySelector('.frame').cloneNode(true)
    }
    node.classList.add('lb-item')
    if (dir && !reduceMotion.matches) node.classList.add(dir > 0 ? 'from-right' : 'from-left')
    media.replaceChildren(node)
    box.style.setProperty('--hue', tile.style.getPropertyValue('--hue') || '28')
    box.querySelector('.lb-room').textContent = tile.dataset.room || ''
    box.querySelector('.lb-label').textContent = tile.dataset.label || ''
    box.querySelector('.lb-count').textContent = `${index + 1} / ${tiles.length}`
  }

  const go = (step) => {
    index = (index + step + tiles.length) % tiles.length
    render(step)
  }

  const open = (i) => {
    index = i
    lastFocus = document.activeElement
    box.hidden = false
    document.documentElement.classList.add('lb-open')
    render()
    requestAnimationFrame(() => box.classList.add('is-open'))
    box.querySelector('.lb-close').focus()
  }

  const close = () => {
    box.classList.remove('is-open')
    document.documentElement.classList.remove('lb-open')
    box.hidden = true
    lastFocus?.focus?.()
  }

  box.querySelector('.lb-close').addEventListener('click', close)
  box.querySelector('.lb-prev').addEventListener('click', () => go(-1))
  box.querySelector('.lb-next').addEventListener('click', () => go(1))
  box.addEventListener('click', (event) => {
    if (event.target === box || event.target === stage) close()
  })
  box.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      close()
    } else if (event.key === 'ArrowRight') go(1)
    else if (event.key === 'ArrowLeft') go(-1)
    else if (event.key === 'Tab') {
      const focusable = [...box.querySelectorAll('button')]
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  })

  // swipe
  let startX = null
  let startY = null
  stage.addEventListener('pointerdown', (event) => {
    startX = event.clientX
    startY = event.clientY
  })
  stage.addEventListener('pointerup', (event) => {
    if (startX == null) return
    const dx = event.clientX - startX
    const dy = event.clientY - startY
    startX = null
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close()
  })

  return { open, isOpen: () => !box.hidden }
}

/* ---------- scroll-spy dos chips ---------- */
function setupSpy(sections, chipsNav, root = null) {
  if (!sections.length || !chipsNav || !('IntersectionObserver' in window)) return
  const chips = new Map([...chipsNav.querySelectorAll('[data-chip]')].map((chip) => [chip.dataset.chip, chip]))
  const visible = new Map()
  const activate = (id) => {
    chips.forEach((chip, key) => {
      const on = key === id
      chip.classList.toggle('is-active', on)
      if (on) chip.setAttribute('aria-current', 'true')
      else chip.removeAttribute('aria-current')
    })
    const chip = chips.get(id)
    if (chip) {
      const left = chip.offsetLeft - (chipsNav.clientWidth - chip.clientWidth) / 2
      chipsNav.scrollTo({ left, behavior: behavior() })
    }
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => visible.set(entry.target.dataset.roomId, entry.isIntersecting))
      const first = sections.find((section) => visible.get(section.dataset.roomId))
      if (first) activate(first.dataset.roomId)
    },
    { root, rootMargin: '-30% 0px -55% 0px', threshold: 0 },
  )
  sections.forEach((section) => io.observe(section))
  activate(sections[0].dataset.roomId)

  chipsNav.querySelectorAll('[data-chip]').forEach((chip) => {
    chip.addEventListener('click', (event) => {
      const target = document.getElementById(chip.getAttribute('href').slice(1))
      if (!target) return
      event.preventDefault()
      if (root) {
        const offset = root.querySelector('.tour-bar')?.offsetHeight || 0
        root.scrollTo({ top: target.offsetTop - offset - 8, behavior: behavior() })
      } else {
        target.scrollIntoView({ behavior: behavior(), block: 'start' })
      }
      activate(chip.dataset.chip)
    })
  })
}

/* ---------- tour de fotos (tela cheia) ---------- */
function setupTour() {
  const tour = document.getElementById('tour')
  if (!tour) return
  const scroller = tour.querySelector('[data-tour-scroller]')
  const tourTiles = [...tour.querySelectorAll('.tile[data-lb]')]
  const lightbox = setupLightbox(tourTiles)
  const indexOf = new Map(tourTiles.map((tile, i) => [tile.dataset.lb, i]))
  let pushed = false

  const open = (push = true) => {
    tour.classList.add('is-open')
    document.documentElement.classList.add('tour-open')
    if (push && location.hash !== '#tour') {
      history.pushState({ tour: true }, '', '#tour')
      pushed = true
    }
    scroller.scrollTop = 0
    tour.querySelector('.tour-back')?.focus({ preventScroll: true })
  }
  const close = (fromPop = false) => {
    if (!tour.classList.contains('is-open')) return
    tour.classList.remove('is-open')
    document.documentElement.classList.remove('tour-open')
    if (!fromPop) {
      if (pushed) history.back()
      else history.replaceState(null, '', location.pathname + location.search + '#fotos')
    }
    pushed = false
    document.getElementById('fotos')?.scrollIntoView({ block: 'start' })
  }

  document.querySelectorAll('[data-tour-open]').forEach((link) =>
    link.addEventListener('click', (event) => {
      event.preventDefault()
      open()
    }),
  )
  tour.querySelectorAll('[data-tour-close]').forEach((link) =>
    link.addEventListener('click', (event) => {
      event.preventDefault()
      close()
    }),
  )
  window.addEventListener('popstate', () => {
    if (location.hash === '#tour') open(false)
    else close(true)
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && tour.classList.contains('is-open') && !lightbox?.isOpen()) close()
  })
  if (location.hash === '#tour') open(false)

  // cliques nas fotos: tour e mosaico abrem o lightbox na mesma ordem
  document.querySelectorAll('.tile[data-lb]').forEach((tile) => {
    tile.addEventListener('click', () => {
      const i = indexOf.get(tile.dataset.lb)
      if (i != null) lightbox?.open(i)
    })
  })

  setupSpy([...tour.querySelectorAll('.room')], tour.querySelector('.chips'), scroller)
  popIn(tourTiles, scroller)
}

/* ---------- catálogo ---------- */
function setupCatalog() {
  const nav = document.querySelector('.chips--cat')
  if (!nav) return
  setupSpy([...document.querySelectorAll('.cat')], nav)
  popIn([...document.querySelectorAll('.inv-card')])
}

export function setupGallery() {
  const mosaic = document.querySelector('[data-carousel]')
  if (mosaic) {
    setupCarousel(mosaic)
    popIn([...mosaic.querySelectorAll('.mosaic-item')])
  }
  setupTour()
  setupCatalog()
}
