import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

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
  }
}

function formatBrazilPhone(digits) {
  const m = String(digits).match(/^55(\d{2})(\d{4,5})(\d{4})$/)
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : `+${digits}`
}

function applyConfig(html, cfg) {
  const waText = `Olá! Vi o anúncio da Renault Master ${cfg.year} em Anitápolis/SC. Preço pedido ${cfg.priceLabel}. Quero saber mais — pode ser visita ou videochamada sem compromisso.`
  const waHref = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(waText)}`
  const notice = cfg.whatsappIsPlaceholder
    ? `<p class="config-notice" role="status">WhatsApp ainda é o número de exemplo. Antes de divulgar, edite <code>site.config.json</code> ou defina <code>WHATSAPP_NUMBER</code>.</p>`
    : ''
  const robots = cfg.whatsappIsPlaceholder ? 'noindex, nofollow' : 'index, follow'

  const replacements = [
    ['__PRICE_LABEL_JSON__', escapeJson(cfg.priceLabel)],
    ['__PRICE_LABEL__', escapeHtml(cfg.priceLabel)],
    ['__PRICE_AMOUNT__', String(cfg.priceAmount)],
    ['__KM_LABEL_JSON__', escapeJson(cfg.kilometersLabel)],
    ['__KM_LABEL__', escapeHtml(cfg.kilometersLabel)],
    ['__KM_VALUE__', String(cfg.kilometersValue)],
    ['__YEAR__', String(cfg.year)],
    ['__WA_HREF__', waHref],
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
