import axios from 'axios'

import { BASE_URL, API_TOKEN } from 'src/constants'

/**
 * Klient pro dotazy do Strapi.
 *
 * Dřív se baseURL i autorizační hlavička nastavovaly globálně v _app.tsx.
 * App Router žádný _app nemá a datové funkce běží v Server Components ještě
 * předtím, než se vykreslí jakákoli klientská komponenta — globální
 * konfigurace by se tedy nestihla uplatnit a dotazy by odcházely
 * neautorizované.
 *
 * API_TOKEN je bez prefixu NEXT_PUBLIC_, takže se do klientského bundlu
 * nedostane a hlavička se nastavuje jen tam, kde token existuje.
 */
export const api = axios.create({
  baseURL: BASE_URL,
  headers: API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : undefined,
})

export default api
