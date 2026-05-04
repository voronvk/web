import { curatedFeaturedRobloxGames } from '../data/site';

function chunk<T>(arr: T[], size: number): T[][] {
	const out: T[][] = [];
	for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
	return out;
}

type GameV1 = { id: number; playing: number; visits: number; name?: string };

async function fetchGamesV1(universeIds: number[]): Promise<Map<number, GameV1>> {
	const map = new Map<number, GameV1>();
	for (const part of chunk(universeIds, 50)) {
		const r = await fetch(
			`https://games.roblox.com/v1/games?universeIds=${part.join(',')}`,
			{ headers: { Accept: 'application/json' } },
		);
		if (!r.ok) continue;
		const j = (await r.json()) as { data: GameV1[] };
		for (const g of j.data ?? []) {
			map.set(g.id, g);
		}
	}
	return map;
}

async function placeIdToUniverseId(placeId: number): Promise<number | null> {
	const r = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`, {
		headers: { Accept: 'application/json' },
	});
	if (!r.ok) return null;
	const j = (await r.json()) as { universeId?: number };
	return typeof j.universeId === 'number' ? j.universeId : null;
}

async function fetchThumbnails(universeIds: number[]): Promise<Map<number, string>> {
	const map = new Map<number, string>();
	for (const part of chunk(universeIds, 100)) {
		const u = new URL('https://thumbnails.roblox.com/v1/games/icons');
		u.searchParams.set('size', '512x512');
		u.searchParams.set('format', 'Png');
		u.searchParams.set('isCircular', 'false');
		for (const id of part) u.searchParams.append('universeIds', String(id));
		const r = await fetch(u);
		if (!r.ok) continue;
		const j = (await r.json()) as {
			data: { targetId: number; imageUrl?: string; state?: string }[];
		};
		for (const row of j.data ?? []) {
			if (row.imageUrl) map.set(row.targetId, row.imageUrl);
		}
	}
	return map;
}

export type RobloxGameCardPayload = {
	universeId: number;
	placeId: number;
	name: string;
	playing: number;
	visits: number;
	thumbnailUrl: string | null;
	gameUrl: string;
};

/** Solo juegos en `curatedFeaturedRobloxGames` (tus enlaces). No lista grupos de Roblox. */
export async function getCuratedRobloxGamesPayload(): Promise<{ games: RobloxGameCardPayload[] }> {
	const games: RobloxGameCardPayload[] = [];
	if (curatedFeaturedRobloxGames.length === 0) {
		return { games };
	}

	const resolved: {
		universeId: number;
		placeId: number;
		name: string;
		gameUrl: string;
	}[] = [];
	for (const c of curatedFeaturedRobloxGames) {
		const universeId = await placeIdToUniverseId(c.placeId);
		if (universeId == null) continue;
		resolved.push({
			universeId,
			placeId: c.placeId,
			name: c.name,
			gameUrl: c.gameUrl,
		});
	}
	const universeIds = resolved.map((r) => r.universeId);
	const [statsMap, thumbMap] = await Promise.all([
		fetchGamesV1(universeIds),
		fetchThumbnails(universeIds),
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
			gameUrl: row.gameUrl,
		});
	}

	return { games };
}
