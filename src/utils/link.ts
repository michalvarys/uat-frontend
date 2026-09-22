import { PUBLIC_API_URL } from 'src/constants'

/**
 * Doplní k cestě ze Strapi předponu, na které je soubor dostupný.
 *
 * Server volá Strapi vnitřní sítí Dockeru (http://strapi:1337), ale
 * obrázky vykresluje prohlížeč — tomu by vnitřní jméno kontejneru nic
 * neřeklo. Odkazy proto vedou na relativní /cms, které middleware
 * přepošle na Strapi. Veřejná adresa CMS tak není potřeba nikde.
 */
export const transformLink = (url: string): string => {
  url = url?.trim() || ''

  if (url.startsWith('http')) {
    return url
  }

  return `${PUBLIC_API_URL}${url}`
}

/**
 * Odkazy na vlastní obsah jsou po transformLink relativní, takže vše
 * s protokolem míří jinam.
 */
export function isExternalLink(url: string) {
  return (url?.trim() || '').startsWith('http')
}
