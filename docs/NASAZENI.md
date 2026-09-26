# Nasazení migrace na produkci

Postup pro vydání migrace Next 11 → 16 + App Router a backendových oprav.
Stav k 17. 9. 2026.

## Co se nasazuje

| Repozitář | Větev | Commitů | Stav |
|---|---|---|---|
| `frontend` | `feature/next-app-router` | 26 | neodesláno |
| `admin-v4-ts` | `master` | 3 | neodesláno |

**Pozor:** backendové změny jsem commitnul rovnou do `master`. Pokud máte
na backendu chráněnou větev nebo review proces, je potřeba je nejdřív
přesunout do samostatné větve:

```bash
cd admin-v4-ts
git branch feature/slug-history
git reset --hard origin/master      # master zpět na odeslaný stav
git checkout feature/slug-history
```

## Pořadí je důležité

Backend musí jít první. Frontend se ptá na `/api/slug-histories`, který
na starém backendu neexistuje — dotaz sice selže potichu (vrací `null`,
takže se jen nepřesměruje), ale zbytečně by se logovaly chyby.

```
1. záloha databáze
2. backend  (nové API + lifecycle hooky)
3. frontend (App Router, sitemap, přesměrování)
4. Search Console
```

---

## Rychlá varianta: deploy.sh

Celý postup níž zvládne jeden skript na serveru — zazálohuje, nasadí
a ověří:

Skript leží v `prod/deploy.sh`. Ta složka **není git repozitář**
(a `sync.sh` táhne data ze serveru k vám, ne naopak), takže ho tam
poprvé nahrajte ručně:

```bash
scp prod/deploy.sh root@185.111.88.136:/root/repo/docker/
ssh root@185.111.88.136 'chmod +x /root/repo/docker/deploy.sh'
```

Pak už na serveru:

```bash
cd /root/repo/docker
./deploy.sh --dry-run      # nejdřív si prohlédnout, co udělá
./deploy.sh --tag v2.0.0   # ostré nasazení
```

Zálohuje databázi i uploady, nasadí backend a pak frontend (v tomhle
pořadí), počká na naběhnutí a ověří, že se obsah renderuje na serveru.
Když ověření selže, poradí návrat: `./deploy.sh --rollback`.

Další přepínače: `--frontend`, `--backend`, `--skip-backup`.
Skript odmítne pokračovat, pokud je dump databáze podezřele malý.

Zbytek dokumentu popisuje ty samé kroky ručně — pro případ, že chcete
mít nad nasazením plnou kontrolu nebo skript z nějakého důvodu selže.

---

## 1. Záloha databáze

Nasazení backendu přidá tabulku `slug_histories` a sloupce `seo` do sedmi
content typů. Strapi to udělá samo při startu, ale je to zásah do schématu.

```bash
# na serveru
docker exec database pg_dump -U uat_user uat_cms | gzip > /backups/pred-migraci-$(date +%F).sql.gz
ls -lh /backups/ | tail -3
```

Ověřte, že soubor má rozumnou velikost — ne pár bajtů.

## 2. Backend

Backend má nově **stejné CI jako frontend** — build se spustí pushnutím
tagu `v*`:

```bash
cd admin-v4-ts
git push origin <větev>
# merge do master, pak:
git tag v2.0.0 && git push origin v2.0.0
```

Workflow postaví a odešle `varyshop/uat-admin`. Průběh v záložce Actions.
Vyžaduje tajné klíče `DOCKERHUB_USERNAME` a `DOCKERHUB_TOKEN` — stejné,
jaké už používá frontend.

Ručně (bez CI) to jde takto:

```bash
docker build -t varyshop/uat-admin:latest .
docker push varyshop/uat-admin:latest
```

> **Build padal** na `yarn global add node-gyp` — nejnovější node-gyp
> vyžaduje Node 22, zatímco image stojí na Node 18. Verze je nově
> připnutá na 10.2.0, takže build projde. Byla to existující vada,
> jen se dlouho neprojevila.

Na serveru:

```bash
cd /cesta/k/prod
docker compose pull strapi
docker compose up -d --force-recreate strapi
docker compose logs -f strapi   # počkat na "Welcome back!"
```

### Ověření backendu

```bash
# tabulka historie vznikla
docker exec database psql -U uat_user -d uat_cms -c "\d slug_histories"

# SEO pole existují
docker exec database psql -U uat_user -d uat_cms -c "\d pages" | grep -i seo

# API odpovídá
curl -s -o /dev/null -w "%{http_code}\n" https://cms.uat.sk/api/pages?pagination[pageSize]=1
```

V administraci pak zkuste **založit anglický překlad slovenské stránky** —
dřív to padalo na „This attribute must be unique", nově projde a slug
dostane příponu `-en`.

## 3. Frontend

Frontend má CI: build se spustí pushnutím tagu `v*`.

```bash
cd frontend
git push origin feature/next-app-router
# merge do master přes PR, pak:
git checkout master && git pull
git tag v2.0.0 && git push origin v2.0.0
```

Workflow postaví `varyshop/uat-frontend` s doménami `uat.sk` a `cms.uat.sk`.
Průběh v záložce Actions.

Na serveru:

```bash
docker compose pull frontend
docker compose up -d --force-recreate frontend
docker compose logs -f frontend
```

> **Build trvá déle než dřív** — generuje se 1328 stránek místo 658
> (obě jazykové varianty zvlášť). Počítejte s několika minutami.

### Ověření frontendu

```bash
# stránky odpovídají a URL se nezměnily
for u in / /en /news /teachers /galleries /documents /about-school; do
  printf "%-20s " "$u"
  curl -s -o /dev/null -w "%{http_code}\n" "https://uat.sk$u"
done

# SEO výstupy
curl -s https://uat.sk/robots.txt
curl -s https://uat.sk/sitemap.xml | grep -c "<loc>"    # očekávaných ~664

# obsah se renderuje na serveru (dřív vracel prázdnou slupku)
curl -s https://uat.sk/studies/4 | grep -c "<h1"        # musí být ≥ 1
```

**V prohlížeči proklikat:**

- otevřít mobilní menu (dřív padalo na `findDOMNode`)
- přepnout jazyk SK ↔ EN
- otevřít detail novinky, stránky, oboru, festivalu
- na `/teachers` kliknout na učitele (otevře se modal s `?id=`)
- na `/news` přepnout ročník

## 4. Google Search Console

```
https://search.google.com/search-console
→ Sitemaps → přidat: https://uat.sk/sitemap.xml
```

Sitemap dosud neexistovala, takže je to poprvé. Indexace nových stránek
se projeví v řádu dnů až týdnů.

---

## Když se něco pokazí

Oba image mají předchozí verzi, návrat je rychlý:

```bash
docker compose stop frontend
docker run -d --name frontend varyshop/uat-frontend:<předchozí-tag>
```

Backend stejně. **Databázové schéma se vracet nemusí** — přidané sloupce
a tabulka starému kódu nevadí, jen je ignoruje.

## Co po nasazení zůstává rozdělané

Nic z toho nebrání provozu, ale stojí za doplnění:

1. **Doplnit SEO pole v CMS.** Komponenta je připravená, ale prázdná.
   Metadata se zatím odvozují z obsahu — funguje to, ale ruční titulky
   a popisky budou lepší. Nejdřív u nejnavštěvovanějších stránek.

2. **`alt` u obrázků z editoru.** `@ssupat/components` renderuje
   `<Image {...attrs} />` bez `alt` (`renderJson.tsx:66`). Je to
   v `node_modules`, takže je potřeba vydat novou verzi knihovny.

3. **Dvě stránky mají v adrese měkký spojovník**
   (`multi­funkcna-...`, `najuspes­­nejsi-...`). Opraví se samy, až je
   někdo uloží — historie slugů pak zajistí přesměrování ze staré adresy.

4. **`strictNullChecks`** je vypnutý. Next 16 si ho zapnul sám a odhalil
   33 typových chyb v 18 souborech. Většina jsou skutečné díry
   v ošetření `null`, jen dosud skryté.

5. **Měkké spojovníky v titulcích** — `src/locales/{sk,en}.ts` obsahují
   11 znaků `­` a jedno `\n`, které se propisují do `<title>`.
