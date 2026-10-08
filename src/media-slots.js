/**
 * Fotos e vídeo reais deste motorhome.
 *
 * A galeria e a foto do hero só aparecem com "showGallery": true em
 * site.config.json. Enquanto ela estiver false, a página mostra no lugar o
 * bloco "Receba fotos e o tour em vídeo no WhatsApp".
 *
 * Para ligar a galeria:
 * 1. Salve cada arquivo em public/media/ (veja public/media/README.md).
 * 2. Troque null pelo caminho, começando com "./media/".
 *    Exemplo: hero: "./media/hero.jpg"
 * 3. Mude "showGallery" para true e rode npm run build. O check-content
 *    recusa a galeria ligada com alguma foto faltando.
 *
 * Não aponte para banco de imagens nem foto de outro veículo.
 */
export const mediaSlots = {
  hero: null,
  leitura: null,
  quarto: null,
  led: null,
  interior: null,
  banho: null,
  agua: null,
  solar: null,
  baterias: null,
  geladeira: null,
  camas: null,
  banheiro: null,
  motor: null,
  exterior: null,
  serra: null,
  walkthrough: null,
}
