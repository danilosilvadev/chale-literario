/**
 * Fotos e vídeo deste motorhome.
 *
 * Enquanto o valor for null, a página mostra um bloco creme/cinza
 * com a legenda "— placeholder". Não aponte para banco de imagens.
 *
 * Para publicar um arquivo real:
 * 1. Salve em public/media/ (veja public/media/README.md).
 * 2. Troque null por um caminho começando com "./media/".
 *    Exemplo: hero: "./media/hero.jpg"
 *
 * O caminho é em relação à página publicada, não a este arquivo.
 */
export const mediaSlots = {
  hero: null,
  frente: null,
  lateral: null,
  interior: null,
  led: null,
  portas: null,
  quarto: null,
  estante: null,
  cozinha: null,
  banheiro: null,
  solar: null,
  baterias: null,
  mesa: null,
  isolamento: null,
  walkthrough: null,
}
