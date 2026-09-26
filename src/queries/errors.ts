import axios from 'axios'

/**
 * Rozliší „záznam neexistuje" od „dotaz se nepovedl".
 *
 * Strapi vrací na chybějící záznam stav 404, zatímco výpadek sítě nebo
 * chyba serveru přijdou jinak (bez odpovědi, nebo se stavem 5xx).
 * Bez tohoto rozlišení se obojí chytalo stejným `catch` a stránka pak
 * na dočasný výpadek reagovala trvalou 404 — nebo prázdným obsahem.
 */
export function isNotFound(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false
  }

  return error.response?.status === 404
}

/**
 * Obalí dotaz na detail záznamu.
 *
 * Chybějící záznam vrátí jako `null`, aby na něj stránka mohla odpovědět
 * 404. Cokoli jiného — výpadek CMS, chyba sítě, rozbitá odpověď —
 * propustí dál jako výjimku.
 *
 * Polykat i tyhle chyby by znamenalo, že se návštěvníkovi místo obsahu
 * ukáže prázdná stránka nebo 404, a Next si takovou odpověď navíc uloží
 * do cache na `revalidate` sekund. Výjimka se naopak necachuje — projeví
 * se jako chyba a při dalším požadavku se obsah načte znovu.
 */
export async function findOrNull<T>(load: () => Promise<T>): Promise<T | null> {
  try {
    return await load()
  } catch (error) {
    if (isNotFound(error)) {
      return null
    }

    throw error
  }
}
