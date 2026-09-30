/**
 * Naplní stránky obsahem hned po startu kontejneru.
 *
 * Build v CI běží bez přístupu k CMS, takže se do image dostanou jen
 * prázdné slupky bez obsahu. Next je považuje za platné a sám je
 * neobnoví — návštěvník tak vidí prázdnou stránku, dokud jí nevyprší
 * platnost, a na málo navštěvované stránce i mnohem déle.
 *
 * Při startu kontejneru už je CMS dostupné, takže si obsah vyžádáme
 * sami: stránky se označí za neplatné a hned se načtou, aby se
 * vygenerovaly dřív, než na ně někdo přijde.
 */

/** Stránky, které má smysl mít hotové hned — rozcestníky a přehledy. */
const PATHS = [
  '/',
  '/news',
  '/teachers',
  '/about-school',
  '/galleries',
  '/documents',
]

export async function register() {
  // Edge runtime nemá k dispozici síť ve stejné podobě a hook se volá
  // i tam; naplnění stačí udělat jednou v Node.js.
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return
  }

  // Při buildu server neběží, takže by volání skončila chybou.
  if (process.env.NEXT_BUILD_PHASE === '1') {
    return
  }

  const secret = process.env.REVALIDATE_SECRET

  if (!secret) {
    // eslint-disable-next-line no-console
    console.warn(
      '[warmup] REVALIDATE_SECRET není nastavené, stránky se naplní až za běhu.'
    )
    return
  }

  // Revalidace se dělá přes vlastní endpoint, ne voláním revalidatePath
  // přímo: tady pro něj chybí kontext vykreslování a skončil by chybou
  // „static generation store missing".
  //
  // Až poté, co register doběhne — server začne přijímat požadavky
  // teprve pak a čekání na vlastní odpověď by ho zablokovalo.
  const port = process.env.PORT || '3000'
  const base = `http://127.0.0.1:${port}`

  setTimeout(() => {
    void (async () => {
      try {
        // Nejdřív označit za neplatné…
        await Promise.allSettled(
          PATHS.map((path) =>
            fetch(`${base}/api/revalidate`, {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                'x-revalidate-secret': secret,
              },
              body: JSON.stringify({ path }),
            })
          )
        )

        // …a hned vyrobit obsah, ať na něj nečeká první návštěvník.
        const results = await Promise.allSettled(
          PATHS.map((path) =>
            fetch(`${base}${path}`, { headers: { 'x-warmup': '1' } })
          )
        )

        const ok = results.filter((r) => r.status === 'fulfilled').length
        // eslint-disable-next-line no-console
        console.log(`[warmup] Připraveno ${ok} z ${PATHS.length} stránek.`)
      } catch (error) {
        // Nepodařený warmup nesmí nic shodit — stránky se naplní
        // při prvním požadavku jako dosud.
        // eslint-disable-next-line no-console
        console.warn(
          '[warmup] Stránky se nepodařilo připravit:',
          error instanceof Error ? error.message : error
        )
      }
    })()
  }, 2000)
}
