const curatedFeaturedRobloxGames = [
  {
    placeId: 84101125715344,
    gameUrl: "https://www.roblox.com/games/84101125715344/My-Tomato-Incremental",
    name: "My Tomato Incremental!"
  },
  {
    placeId: 120901689792962,
    gameUrl: "https://www.roblox.com/games/120901689792962/My-Egg-Incremental",
    name: "My Egg Incremental!"
  },
  {
    placeId: 90607799581188,
    gameUrl: "https://www.roblox.com/games/90607799581188/Idle-Melon-Incremental",
    name: "Idle Melon Incremental"
  }
];

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
async function fetchGamesV1(universeIds) {
  const map = /* @__PURE__ */ new Map();
  for (const part of chunk(universeIds, 50)) {
    const r = await fetch(
      `https://games.roblox.com/v1/games?universeIds=${part.join(",")}`,
      { headers: { Accept: "application/json" } }
    );
    if (!r.ok) continue;
    const j = await r.json();
    for (const g of j.data ?? []) {
      map.set(g.id, g);
    }
  }
  return map;
}
async function placeIdToUniverseId(placeId) {
  const r = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`, {
    headers: { Accept: "application/json" }
  });
  if (!r.ok) return null;
  const j = await r.json();
  return typeof j.universeId === "number" ? j.universeId : null;
}
async function fetchThumbnails(universeIds) {
  const map = /* @__PURE__ */ new Map();
  for (const part of chunk(universeIds, 100)) {
    const u = new URL("https://thumbnails.roblox.com/v1/games/icons");
    u.searchParams.set("size", "512x512");
    u.searchParams.set("format", "Png");
    u.searchParams.set("isCircular", "false");
    for (const id of part) u.searchParams.append("universeIds", String(id));
    const r = await fetch(u);
    if (!r.ok) continue;
    const j = await r.json();
    for (const row of j.data ?? []) {
      if (row.imageUrl) map.set(row.targetId, row.imageUrl);
    }
  }
  return map;
}
async function getCuratedRobloxGamesPayload() {
  const games = [];
  if (curatedFeaturedRobloxGames.length === 0) {
    return { games };
  }
  const resolved = [];
  for (const c of curatedFeaturedRobloxGames) {
    const universeId = await placeIdToUniverseId(c.placeId);
    if (universeId == null) continue;
    resolved.push({
      universeId,
      placeId: c.placeId,
      name: c.name,
      gameUrl: c.gameUrl
    });
  }
  const universeIds = resolved.map((r) => r.universeId);
  const [statsMap, thumbMap] = await Promise.all([
    fetchGamesV1(universeIds),
    fetchThumbnails(universeIds)
  ]);
  for (const row of resolved) {
    const st = statsMap.get(row.universeId);
    const playing = st?.playing ?? 0;
    const visits = st?.visits ?? 0;
    const nameFromApi = st?.name;
    games.push({
      universeId: row.universeId,
      placeId: row.placeId,
      name: nameFromApi && nameFromApi.trim() ? nameFromApi : row.name,
      playing,
      visits,
      thumbnailUrl: thumbMap.get(row.universeId) ?? null,
      gameUrl: row.gameUrl
    });
  }
  return { games };
}

const prerender = false;
const GET = async () => {
  try {
    const { games } = await getCuratedRobloxGamesPayload();
    return new Response(JSON.stringify({ games }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60, s-maxage=60"
      }
    });
  } catch {
    return new Response(JSON.stringify({ error: "failed", games: [] }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
