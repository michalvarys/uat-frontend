/**
 * Rozliší build od běhu aplikace.
 *
 * Next při buildu předgeneruje stránky, jenže v CI žádné CMS neběží —
 * dotazy tam skončí na ECONNREFUSED. Build proto nesmí na nedostupné
 * CMS spadnout: stránku jen nepředgeneruje a vykreslí se až při prvním
 * požadavku, kdy už CMS dostupné je.
 *
 * Za běhu naopak musí být chyba vidět. Kdyby se polykala i tam,
 * návštěvníkovi se místo obsahu ukáže prázdná stránka — a Next si ji
 * navíc uloží do cache.
 *
 * NEXT_BUILD_PHASE nastavuje skript `build` v package.json. Vlastní
 * proměnná je spolehlivější než NEXT_PHASE od Nextu: ten ji nastavuje
 * v hlavním procesu, ale předgenerování běží ve workerech, kam se
 * nemusí propsat.
 */
export function isBuildPhase(): boolean {
  return process.env.NEXT_BUILD_PHASE === '1'
}

/**
 * Dotaz na obsah, bez kterého se stránka nedá vykreslit.
 *
 * Při buildu v CI žádné CMS neběží. Stránka se tehdy předgeneruje
 * prázdná a Next ji díky `revalidate` naplní při prvním požadavku,
 * kdy už CMS dostupné je — tak se web choval i dosud.
 *
 * Za běhu se chyba propustí dál. To je celý rozdíl oproti původnímu
 * `catch { return null }`: ten polykal chyby i za běhu, takže výpadek
 * CMS skončil prázdnou stránkou uloženou do cache.
 */
export async function skipDuringBuild<T>(
  load: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await load()
  } catch (error) {
    if (isBuildPhase()) {
      // eslint-disable-next-line no-console
      console.warn(
        '[build] CMS nedostupné, stránka se naplní až za běhu:',
        error instanceof Error ? error.message : error
      )
      return fallback
    }

    throw error
  }
}
