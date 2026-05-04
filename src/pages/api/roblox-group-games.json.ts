import type { APIRoute } from 'astro';
import { getRobloxGroupId } from '../../data/site';

export const prerender = false;

const excludeTestingDefault = true;

type GroupListRow = {
	id: number;
	name: string;
	rootPlace: { id: number };
	placeVisits: number;
};

function chunk<T>(arr: T[], size: number): T[][] {
	const out: T[][] = [];
	for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
	return out;
}

async function fetchAllGroupGames(groupId: number): Promise<GroupListRow[]> {
	const all: GroupListRow[] = [];
	let cursor: string | undefined;
	for (let guard = 0; guard < 100; guard++) {
		const u = new URL(`https://games.roblox.com/v2/groups/${groupId}/games`);
		u.searchParams.set('accessFilter', 'All');
		u.searchParams.set('sortOrder', 'Desc');
		u.searchParams.set('limit', '50');
		if (cursor) u.searchParams.set('cursor', cursor);
		const r = await fetch(u, { headers: { Accept: 'application/json' } });
		if (!r.ok) throw new Error('group_list');
		const j = (await r.json()) as { data: GroupListRow[]; nextPageCursor?: string };
		all.push(...(j.data ?? []));
		cursor = j.nextPageCursor;
		if (!cursor) break;
	}
	return all;
}

type GameV1 = { id: number; playing: number; visits: number };

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

export const GET: APIRoute = async () => {
	try {
		const groupId = getRobloxGroupId();
		let rows = await fetchAllGroupGames(groupId);
		if (excludeTestingDefault) {
			rows = rows.filter((g) => !/\[TESTING\]/i.test(g.name));
		}
		const universeIds = rows.map((r) => r.id);
		const [statsMap, thumbMap] = await Promise.all([
			fetchGamesV1(universeIds),
			fetchThumbnails(universeIds),
		]);
		const games = rows
			.map((row) => {
				const st = statsMap.get(row.id);
				const playing = st?.playing ?? 0;
				const visits = st?.visits ?? row.placeVisits;
				return {
					universeId: row.id,
					placeId: row.rootPlace.id,
					name: row.name,
					playing,
					visits,
					thumbnailUrl: thumbMap.get(row.id) ?? null,
					gameUrl: `https://www.roblox.com/games/${row.rootPlace.id}`,
				};
			})
			.sort((a, b) => b.visits - a.visits);
		return new Response(JSON.stringify({ groupId, games }), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=60, s-maxage=60',
			},
		});
	} catch {
		return new Response(JSON.stringify({ error: 'failed', games: [] }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
