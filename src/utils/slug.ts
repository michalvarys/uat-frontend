/**
 * Dekóduje slug z parametrů routy.
 *
 * Next předává hodnotu z URL v zakódované podobě, takže slug obsahující
 * neobvyklé znaky (například měkký spojovník, který se do názvů dostal
 * z CMS kvůli zalamování) dorazí jako "najuspes%C2%ADnejsi". Do dotazu
 * na Strapi ale patří původní text, jinak se záznam nenajde a stránka
 * skončí na 404.
 */
export function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug)
  } catch {
    // Neplatná sekvence — lepší zkusit hledat původní hodnotu než spadnout.
    return slug
  }
}
