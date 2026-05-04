import type { APIRoute } from 'astro';
import { getCuratedRobloxGamesPayload } from '../../lib/roblox-group-games';

export const prerender = false;

export const GET: APIRoute = async () => {
	try {
		const { games } = await getCuratedRobloxGamesPayload();
		return new Response(JSON.stringify({ games }), {
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
