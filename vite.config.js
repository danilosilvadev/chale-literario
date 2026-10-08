import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { renderBlocks } from './scripts/blocks.mjs'

const root = path.dirname(fileURLToPath(import.meta.url))
const configPath = path.join(root, 'site.config.json')

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function escapeJson(value) {
  return JSON.stringify(String(value)).slice(1, -1)
}

export function readSiteConfig(mode = 'production') {
  const file = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  const env = loadEnv(mode, root, ['WHATSAPP_', 'VITE_'])
  const fromEnv = [process.env.WHATSAPP_NUMBER, env.WHATSAPP_NUMBER].find(
    (value) => value && String(value).trim(),
  )
  const whatsappNumber = String(fromEnv || file.whatsappNumber).replace(/\D/g, '')

  if (whatsappNumber.length < 12 || whatsappNumber.length > 15) {
    throw new Error(
      `Número de WhatsApp inválido ("${whatsappNumber}"). Use só dígitos, com DDI 55, entre 12 e 15 caracteres.`,
    )
  }

  const priceAmount = Number(file.priceAmount)
  const year = Number(file.year)
  const kilometersValue = Number(file.kilometersValue)

  if (!file.priceLabel || !Number.isFinite(priceAmount)) {
    throw new Error('Defina priceLabel e priceAmount em site.config.json.')
  }
  if (!Number.isInteger(year) || year < 1980) {
    throw new Error('Ano inválido em site.config.json.')
  }
  if (!file.kilometersLabel || !Number.isFinite(kilometersValue)) {
    throw new Error('Defina kilometersLabel e kilometersValue em site.config.json.')
  }

  return {
    priceLabel: String(file.priceLabel),
    priceAmount,
    year,
    kilometersLabel: String(file.kilometersLabel),
    kilometersValue,
    whatsappNumber,
    whatsappIsPlaceholder: /^55(0+)$/.test(whatsappNumber),
    whatsappDisplay: formatBrazilPhone(whatsappNumber),
    showGallery: file.showGallery === true,
    ownerPhoto: typeof file.ownerPhoto === 'string' && file.ownerPhoto.trim() ? file.ownerPhoto.trim() : null,
  }
}

function formatBrazilPhone(digits) {
  const m = String(digits).match(/^55(\d{2})(\d{4,5})(\d{4})$/)
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : `+${digits}`
}

// Mensagens prontas do WhatsApp, uma por intenção (auditoria de copy, seção 12).
// "____" é o campo que a pessoa completa antes de enviar.
export const waMessages = {
  padrao: 'Oi! Vi a cabana sobre rodas no site e quero saber mais. Sou de ____.',
  video: 'Oi! Vi a cabana no site e queria ver ela ao vivo por vídeo. Sou de ____ e posso em ____.',
  troca: 'Oi! Vi a cabana no site. Tenho um carro para dar como parte do pagamento: ____ (modelo/ano).',
  duvida: 'Oi! Vi a cabana no site e fiquei com uma dúvida: ____',
  fotos: 'Oi! Vi a cabana no site e queria receber as fotos e o vídeo do tour. Sou de ____.',
  motor: 'Oi! Vi a cabana no site e queria ver o vídeo do motor funcionando. Sou de ____.',
  catalogo: 'Oi! Vi o catálogo completo do motorhome no site e quero saber mais. Sou de ____.',
  item: 'Oi! Vi o catálogo completo do motorhome e queria fotos ou detalhes de: ____',
}

// Blocos condicionais no index.html: <!--if:flag--> ... <!--/if:flag--> e <!--if:!flag--> ... <!--/if:!flag-->
function applyFlags(html, flags) {
  return html.replace(/<!--if:(!?)([a-zA-Z]+)-->\n?([\s\S]*?)<!--\/if:\1\2-->\n?/g, (_, not, name, inner) => {
    const on = Boolean(flags[name])
    return (not ? !on : on) ? inner : ''
  })
}

function applyConfig(html, cfg) {
  const wa = (key) => `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(waMessages[key])}`
  const waHref = wa('padrao')
  const notice = cfg.whatsappIsPlaceholder
    ? `<p class="config-notice" role="status">WhatsApp ainda é o número de exemplo. Antes de divulgar, edite <code>site.config.json</code> ou defina <code>WHATSAPP_NUMBER</code>.</p>`
    : ''
  const robots = cfg.whatsappIsPlaceholder ? 'noindex, nofollow' : 'index, follow'
  const updated = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' }).format(new Date())

  html = applyFlags(html, { gallery: cfg.showGallery, ownerPhoto: Boolean(cfg.ownerPhoto) })
  html = renderBlocks(html)

  const replacements = [
    ['__PRICE_LABEL_JSON__', escapeJson(cfg.priceLabel)],
    ['__PRICE_LABEL__', escapeHtml(cfg.priceLabel)],
    ['__PRICE_AMOUNT__', String(cfg.priceAmount)],
    ['__KM_LABEL_JSON__', escapeJson(cfg.kilometersLabel)],
    ['__KM_LABEL__', escapeHtml(cfg.kilometersLabel)],
    ['__KM_VALUE__', String(cfg.kilometersValue)],
    ['__YEAR__', String(cfg.year)],
    ['__WA_HREF_VIDEO__', wa('video')],
    ['__WA_HREF_TROCA__', wa('troca')],
    ['__WA_HREF_DUVIDA__', wa('duvida')],
    ['__WA_HREF_FOTOS__', wa('fotos')],
    ['__WA_HREF_MOTOR__', wa('motor')],
    ['__WA_HREF_CATALOGO__', wa('catalogo')],
    ['__WA_HREF_ITEM__', wa('item')],
    ['__WA_HREF__', waHref],
    ['__OWNER_PHOTO__', escapeHtml(cfg.ownerPhoto || '')],
    ['__UPDATED__', updated],
    ['__WHATSAPP__', cfg.whatsappNumber],
    ['__WA_DISPLAY__', escapeHtml(cfg.whatsappDisplay)],
    ['__CONFIG_NOTICE__', notice],
    ['__ROBOTS__', robots],
  ]

  let out = html
  for (const [token, value] of replacements) {
    out = out.replaceAll(token, value)
  }
  return out
}

export default defineConfig(({ mode }) => ({
  base: './',
  envPrefix: ['VITE_', 'WHATSAPP_'],
  build: {
    rollupOptions: {
      input: {
        main: path.join(root, 'index.html'),
        catalogo: path.join(root, 'catalogo.html'),
      },
    },
  },
  plugins: [
    {
      name: 'site-config',
      transformIndexHtml(html) {
        return applyConfig(html, readSiteConfig(mode))
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 4317,
    strictPort: true,
    allowedHosts: ['.trycloudflare.com'],
  },
  preview: {
    host: '0.0.0.0',
    port: 4317,
    strictPort: true,
    allowedHosts: ['.trycloudflare.com'],
  },
}))
