#!/usr/bin/env bash
#
# Lokální produkční build frontendu do Docker image.
#
# Hodnoty NEXT_PUBLIC_* se zapékají do JS bundlu už při buildu — po něm je
# nelze změnit. Proto je image vždy svázaný s konkrétní doménou backendu.
#
# Použití:
#   ./build-prod.sh                          # výchozí dle prod/.env, tag latest
#   ./build-prod.sh --tag v1.2.0             # konkrétní tag
#   ./build-prod.sh --be-domain uat-api.varyshop.eu --fe-domain uat.varyshop.eu
#   ./build-prod.sh --push                   # po buildu odeslat do registru
#   ./build-prod.sh --help

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()  { echo -e "${RED}[ERROR]${NC} $1" >&2; }

cd "$(dirname "$0")"

# Výchozí hodnoty — přepsatelné argumenty i proměnnými prostředí.
# Výchozí hodnoty odpovídají prod/.env a prod/docker-compose.yml.
IMAGE="${IMAGE:-varyshop/uat-frontend}"
TAG="${TAG:-latest}"
BE_DOMAIN="${BE_DOMAIN:-cms.uat.sk}"
FE_DOMAIN="${FE_DOMAIN:-uat.sk}"
PUSH=false
NO_CACHE=""

usage() {
    sed -n '3,14p' "$0" | sed 's/^# \{0,1\}//'
    exit 0
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --tag)        TAG="$2"; shift 2 ;;
        --image)      IMAGE="$2"; shift 2 ;;
        --be-domain)  BE_DOMAIN="$2"; shift 2 ;;
        --fe-domain)  FE_DOMAIN="$2"; shift 2 ;;
        --push)       PUSH=true; shift ;;
        --no-cache)   NO_CACHE="--no-cache"; shift ;;
        --help|-h)    usage ;;
        *) err "Neznámý argument: $1"; echo "Nápověda: $0 --help" >&2; exit 1 ;;
    esac
done

API_URL="https://${BE_DOMAIN}"
BASE_URL="https://${FE_DOMAIN}/cms"

if ! docker info >/dev/null 2>&1; then
    err "Docker démon neběží nebo k němu nemáš oprávnění."
    exit 1
fi

log "===== Produkční build frontendu ====="
echo "  image:    ${IMAGE}:${TAG}"
echo "  backend:  ${API_URL}"
echo "  frontend: https://${FE_DOMAIN}"
echo

# Backend musí odpovídat — jinak se sice image postaví, ale běžící web
# nenačte žádná data a chyba se projeví až v produkci.
log "Ověřuji dostupnost backendu..."
HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "${API_URL}/" || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    log "Backend odpovídá (HTTP ${HTTP_CODE})"
else
    warn "Backend ${API_URL} vrátil HTTP ${HTTP_CODE} — build bude pokračovat,"
    warn "ale ověř, že je doména správná, než image nasadíš."
fi

log "Spouštím docker build (může trvat několik minut)..."
docker build ${NO_CACHE} \
    -t "${IMAGE}:${TAG}" \
    --build-arg "NEXT_PUBLIC_API_URL=${API_URL}" \
    --build-arg "NEXT_PUBLIC_IMAGE_URL=${API_URL}" \
    --build-arg "NEXT_PUBLIC_API_PORT=443" \
    --build-arg "NEXT_PUBLIC_SECURE_API_PORT=443" \
    --build-arg "NEXT_PUBLIC_BASE_URL=${BASE_URL}" \
    --build-arg "NEXT_FRONTEND_DOMAIN=${FE_DOMAIN}" \
    --build-arg "NEXT_BACKEND_DOMAIN=${BE_DOMAIN}" \
    .

# Tag latest navíc, ať docker-compose bere poslední build bez úprav.
if [ "$TAG" != "latest" ]; then
    docker tag "${IMAGE}:${TAG}" "${IMAGE}:latest"
    log "Označeno i jako ${IMAGE}:latest"
fi

SIZE=$(docker image inspect "${IMAGE}:${TAG}" --format '{{.Size}}' \
       | awk '{printf "%.0f MB", $1/1024/1024}')
log "Image hotový: ${IMAGE}:${TAG} (${SIZE})"

if [ "$PUSH" = true ]; then
    log "Odesílám do registru..."
    docker push "${IMAGE}:${TAG}"
    [ "$TAG" != "latest" ] && docker push "${IMAGE}:latest"
    log "Odesláno"
else
    echo
    log "Image zůstal lokálně. Odeslat do registru: docker push ${IMAGE}:${TAG}"
    log "Spustit lokálně:  docker run --rm -p 3000:3000 ${IMAGE}:${TAG}"
fi
