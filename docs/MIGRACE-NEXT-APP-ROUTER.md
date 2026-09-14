# Migrace frontendu: Next.js 11 → 16 + App Router + SEO

Stav k 14. 9. 2026. Cílová verze **Next.js 16.3.5** (aktuální stabilní, vyžaduje Node ≥ 20.9).

## Rozhodnutí

| Téma | Volba |
|---|---|
| Postup | Po etapách: 11 → 15 → 16 na Pages Routeru, pak přepis na App Router |
| SEO data | Komponenta `shared.seo` ve Strapi **+ automatický fallback z obsahu** |
| i18n | `app/[lang]/`, slovenština **bez prefixu** (`/news`), angličtina `/en/news` |
| `@ssupat/components` | `transpilePackages` místo ruční babel-loader konfigurace |
| Jazykový přepínač | Serverový model; přegenerování stránek přes ISR je akceptováno |

## Výchozí stav

- `frontend/` — Next 11.1.2, Pages Router, 24 souborů v `pages/`, ~185 v `src/`
- `admin-v4-ts/` — Strapi 4.25.13, 18 content typů, **žádná SEO pole**
- Node na stroji v12 (k dispozici v20.20.1, v22.14.0), Docker build na Node 16
- Větev `feature/next-app-router` z `master`

### Ověřeno buildem (14. 9. 2026, Node 20)

Stávající Next 11 build na Node 20 **projde**, ale vyžaduje
`NODE_OPTIONS=--openssl-legacy-provider` — webpack 5 v Nextu 11 používá MD4,
který OpenSSL 3 (Node 17+) zakázal. Po upgradu na Next 15 tento přepínač odpadá.

Objem generovaného obsahu:

| Route | Počet stránek |
|---|---|
| `/news/[slug]` | 524 |
| `/pages/[slug]` | 99 |
| `/studies/[id]` | 14 |
| ostatní | jednotky |

Celkem ~640 statických stránek. Pro sitemap to znamená jeden soubor —
hluboko pod limitem 50 000 URL, `generateSitemaps` není potřeba.

**Pět stránek běží zbytečně přes `getServerSideProps`:** `documents`,
`about-school`, `galleries`, `teachers` (žádné query parametry, jen fetch podle
jazyka → v App Routeru budou statické) a `news/index` (ta má `?year=`, viz níže).

## Co v App Routeru přestane existovat

Tohle jsou body, které nemají mechanickou náhradu a rozhodují o pracnosti:

1. **`next.config.js` klíč `i18n`** (`locales: ['sk','en']`) — Pages Router only. Náhrada: segment `[lang]` + `proxy.ts`.
2. **`publicRuntimeConfig` / `serverRuntimeConfig`** v `src/constants.ts` — v Next 16 odstraněno. `BASE_URL` a `API_TOKEN` musí jít přes `process.env`.
3. **`App.getInitialProps`** v `_app.tsx` (načítá menu + footer pro každou stránku) — nahradí fetch v root layoutu.
4. **`<Image layout="fill" objectFit="cover">`** — odstraněno v 13. Náhrada `fill` + `style`.
5. **`images.domains`** — nahradit `remotePatterns`.
6. **Přepínač jazyků přes `useEffect` + `setLocalePaths`** — dnes každá detailní stránka po hydrataci nahlásí do kontextu cesty lokalizací. V App Routeru musí být tato informace serverová, protože z ní plyne `alternates.languages` (hreflang) v metadatech. Toto je největší skrytá položka přepisu.

---

## Etapa 1 — Příprava (bez změny Nextu)

**Cíl:** aby build běžel na Node 20 a existovala odrazová základna.

- [ ] Nastavit Node 20 (`.nvmrc` → `20`, Dockerfile `node:20-alpine`)
- [ ] Ověřit, že stávající build na Node 20 projde (`yarn build`)
- [ ] Založit větev `feature/next-app-router`
- [ ] Ověřit `@ssupat/components@0.1.5` — je to TS zdroj kompilovaný přes `babel-loader` z `node_modules`. V Next 16 s Turbopackem tahle webpack konfigurace nebude fungovat. Buď knihovnu předkompilovat a vydat novou verzi, nebo ji vendorovat do `src/vendor/`.

> **Riziko:** Bod `@ssupat/components` může etapu prodloužit. Knihovnu používá `_app.tsx` (ThemeProvider, Fonts) i backend `admin-v4-ts`, takže změna verze má dopad na obě aplikace.

## Etapa 2 — Next 11 → 15.5 (stále Pages Router)

Kodemody pokrývají většinu. Spouštět v tomto pořadí, každý zvlášť zkontrolovat diff:

```bash
npx @next/codemod@latest next-image-to-legacy-image .
npx @next/codemod@latest next-image-experimental .   # pozor, dokumentace ho označuje "dangerously"
npx @next/codemod@latest new-link .
npx @next/codemod@canary next-async-request-api .
```

- [ ] Projít diff `next-image-experimental` ručně — převádí `layout`/`objectFit` na `style`
- [ ] `DbImage` (`src/components/DbImage.tsx`) je vlastní wrapper, kodemod ho nepokryje — přepsat ručně
- [ ] `images.domains` → `remotePatterns`
- [ ] Ověřit, že `fetch` už není cachovaný by default (změna v 15) — může tiše rozbít ISR
- [ ] Build + proklikat web

## Etapa 3 — Next 15 → 16.3.5 (stále Pages Router)

- [ ] `npx @next/codemod@canary upgrade latest`
- [ ] Odstranit `publicRuntimeConfig`/`serverRuntimeConfig` z `next.config.js` a přepsat `src/constants.ts` na `process.env`
      - `API_TOKEN` je serverový secret → nesmí dostat prefix `NEXT_PUBLIC_`
      - Pokud se má stavět jeden image pro víc prostředí, číst env až za `await connection()`
- [ ] `next lint` byl odstraněn → přejít na ESLint CLI
- [ ] Turbopack je nově default — ověřit webpack konfiguraci pro `@ssupat/components` (viz Etapa 1)
- [ ] Build + proklikat web

> Po této etapě je web na aktuálním Nextu a **funkční**. Dobrý bod pro nasazení, než se pustíme do routeru.

## Etapa 4 — SEO komponenta ve Strapi (`admin-v4-ts`)

Nezávislé na frontendu, může běžet paralelně s etapami 2–3.

- [ ] Vytvořit `src/components/shared/seo.json`:
      - `metaTitle` (string, max 60)
      - `metaDescription` (text, max 160)
      - `ogImage` (media, single, images)
      - `canonicalUrl` (string, volitelné)
      - `noindex` (boolean, default false)
      - vše s `pluginOptions.i18n.localized: true`
- [ ] Přidat pole `seo` do schémat: `page`, `news-entry`, `festival`, `gallery-event`, `field-of-study`, `homepage`, `about-school`
- [ ] Migrace databáze — Strapi přidá sloupce při restartu, ale **zkontrolovat na kopii produkční DB**, ne na ostré
- [ ] Rozšířit dotazy ve `frontend/src/queries/*.ts` o `populate` pro `seo` a `seo.ogImage`

### Fallback metadat (`src/utils/seo.ts`)

SEO komponenta bude zpočátku prázdná u všech ~640 záznamů, proto se metadata
odvozují automaticky a ruční hodnoty z adminu je jen přebijí:

| Pole | Priorita |
|---|---|
| `title` | `seo.metaTitle` → `title` záznamu |
| `description` | `seo.metaDescription` → perex → první odstavec rich textu (ořez ~160 zn. na hranici slova, strip HTML) |
| `openGraph.images` | `seo.ogImage` → `cover_image` → výchozí OG obrázek webu |
| `canonical` | `seo.canonicalUrl` → vlastní URL stránky |
| `robots` | `seo.noindex` → `index: true` |

Rich text ze Strapi je JSON z tiptap editoru (`renderJSON` v `@ssupat/components`),
takže extrakce textu pro description vyžaduje projít strom uzlů a posbírat
textové listy — ne prostý `strip_tags`.

## Etapa 5 — App Router, skeleton

Oba routery mohou koexistovat, takže tohle jde dělat postupně.

- [ ] `app/layout.tsx` — root, `metadataBase`, `title.template`, výchozí `openGraph`, `robots`
- [ ] `app/[lang]/layout.tsx` — `generateStaticParams` pro `['en']`, fetch menu+footer (náhrada `getInitialProps`)
- [ ] `proxy.ts` — přepis pro variantu "sk bez prefixu":
      - `/en/*` → ponechat
      - vše ostatní → interní rewrite na `/sk/*` (rewrite, **ne** redirect, aby se URL nezměnila)
      - matcher musí vyloučit `_next`, `/cms`, statická aktiva
- [ ] `'use client'` hranice — `AppContext`, `Layout`, Chakra `ThemeProvider` jsou klientské. Držet je co nejníže ve stromu, ať se neztratí výhoda RSC.
- [ ] `app/not-found.tsx`, `app/error.tsx` (náhrada `404.tsx`, `500.tsx`, `_error.js`)

## Etapa 6 — Přepis stránek

Pořadí od nejjednodušší po nejsložitější, ať se vzory ustálí na malém:

| # | Stránka | Dnes | Poznámka |
|---|---|---|---|
| 1 | `documents` | **`getServerSideProps`** | → statická, žádný důvod pro SSR |
| 2 | `about-school` | **`getServerSideProps`** | → statická |
| 3 | `teachers` | **`getServerSideProps`** | → statická |
| 4 | `galleries` | **`getServerSideProps`** | → statická |
| 5 | `index` | `getStaticProps` | homepage |
| 6 | `pages/[slug]` | `getStaticPaths` blocking | + `generateStaticParams` |
| 7 | `news/[slug]` | `getStaticPaths` blocking | |
| 8 | `events/[id]` | `getStaticPaths` blocking | |
| 9 | `festivals/[id]` | `getStaticPaths` blocking | |
| 10 | `studies/[id]` | `getStaticPaths` blocking | |
| 11 | `news/index` | **`getServerSideProps`** | filtrování podle roku přes query — zvážit převod na statické `/news/[year]`, viz níže |

Mapování API:

- `getStaticPaths` + `fallback: 'blocking'` → `generateStaticParams()`, `dynamicParams` je default `true` (chová se stejně)
- `getStaticProps` + `revalidate: 10` → `export const revalidate = 10`
- Filtrování v `pages/*/[slug].tsx` na prázdné slugy zachovat
- Pro každou stránku `generateMetadata()` — ze `seo` komponenty s fallbackem na `title`/`cover_image`

**`news/index` — doporučení:** dnes je `getServerSideProps` jen proto, že se rok bere z `?year=`. Statická varianta `/news/[year]` s `generateStaticParams` přes dostupné roky by dala statické stránky i indexovatelné URL pro každý ročník. Vyžaduje ale redirect z `/news?year=2024`. Rozhodnout před přepisem.

## Etapa 7 — SEO výstupy

- [ ] `app/sitemap.ts` — `MetadataRoute.Sitemap`, načíst všechny publikované záznamy ze Strapi
      - `alternates.languages` pro hreflang (sk bez prefixu, en s `/en`)
      - `lastModified` z `updatedAt`
      - Pokud počet URL přeroste ~50 000 (Google limit), rozdělit přes `generateSitemaps`. Při dnešním objemu obsahu to nehrozí.
- [ ] `app/robots.ts` — `MetadataRoute.Robots`, odkaz na sitemap, disallow `/cms`
- [ ] `alternates.canonical` na každé stránce
- [ ] JSON-LD strukturovaná data — nativní `<script type="application/ld+json">` (ne `next/script`), s escapováním `<` na `<`:
      - `EducationalOrganization` v root layoutu (jde o školu)
      - `NewsArticle` na detailu novinky
      - `Event` na festivalech
      - `BreadcrumbList` na detailních stránkách
- [ ] Sémantické HTML — projít nadpisy, právě teď má každá stránka `<h1>`, což je správně, ale ověřit hierarchii h2/h3 v sekcích
- [ ] `alt` atributy u obrázků z CMS (`next/image` je v nových verzích vyžaduje)

## Etapa 8 — Úklid a nasazení

- [ ] Smazat `pages/` (kromě případných API routes — žádné tam nejsou)
- [ ] Odstranit `.babelrc` (Turbopack ho nepotřebuje), pokud nebrání `@ssupat/components`
- [ ] Dockerfile na Node 20, `output: 'standalone'` pro menší image
- [ ] Ověřit ISR v produkci — `x-nextjs-cache` hlavička
- [ ] **301 redirecty** zkontrolovat: při variantě "sk bez prefixu" se URL nemění, takže by být potřeba neměly. Ověřit na reálných URL.
- [ ] Google Search Console — odeslat novou sitemap

---

## Rozhodnuté otázky

1. **`@ssupat/components`** — ✅ `transpilePackages: ['@ssupat/components']` v `next.config.js`.
   Nativní podpora od Next 13, nahrazuje ruční `babel-loader` pravidlo. Knihovna se
   nemusí předkompilovat ani vendorovat, `admin-v4-ts` zůstane nedotčený.
2. **Fallback SEO metadat** — ✅ implementovat. Priorita:
   `seo.metaTitle` → `title`; `seo.metaDescription` → perex / první odstavec rich textu
   (ořez na ~160 znaků na hranici slova); `seo.ogImage` → `cover_image` → výchozí OG obrázek webu.

3. **Doména pro `metadataBase`** — ✅ `https://uat.sk`. Potvrzeno z `build-prod.sh`
   (`FE_DOMAIN=uat.sk`) a `.github/workflows/build.yml`. Backend `cms.uat.sk`.
   Nová proměnná `NEXT_PUBLIC_SITE_URL` navázaná na `NEXT_FRONTEND_DOMAIN`.

## Zbývá rozhodnout

1. **`news/index`** — nechat dynamické (`?year=`), nebo převést na statické
   `/news/[year]`? Statická varianta dá indexovatelné URL pro každý ročník,
   ale vyžaduje redirect ze starého tvaru. Rozhodnout před Etapou 6.

## Odhad

Etapy 1–3 mají slušné pokrytí kodemody. Etapa 6 nemá mechanickou podporu vůbec — jde o ruční přepis 11 stránek a vyčištění klientských hranic. Etapa 4 zasahuje do produkční databáze, takže potřebuje test na kopii.

Nejrizikovější body: `@ssupat/components` s Turbopackem, přepis jazykového přepínače na serverový model, a migrace DB ve Strapi.
