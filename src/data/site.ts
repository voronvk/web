export const projectPlaceholderImage =
	'https://r2.fivemanage.com/6NQ840l30BWj9rij5CfY2/Roblox/project.png';

export type GameEntry = {
	id: number;
	name: string;
	playing: number;
	visits: number;
	thumbnailUrl: string;
	robloxGameLink: string;
	featured: boolean;
};

/** Única fuente de juegos en la web: tus enlaces a Roblox (placeId + URL). No se usa ningún grupo. */
export const curatedFeaturedRobloxGames: readonly {
	placeId: number;
	gameUrl: string;
	name: string;
}[] = [
	{
		placeId: 84101125715344,
		gameUrl: 'https://www.roblox.com/games/84101125715344/My-Tomato-Incremental',
		name: 'My Tomato Incremental!',
	},
	{
		placeId: 120901689792962,
		gameUrl: 'https://www.roblox.com/games/120901689792962/My-Egg-Incremental',
		name: 'My Egg Incremental!',
	},
	{
		placeId: 90607799581188,
		gameUrl: 'https://www.roblox.com/games/90607799581188/Idle-Melon-Incremental',
		name: 'Idle Melon Incremental',
	},
];

export const heroBannerThumbnails: string[] = [
	'/imagenes/Juego1.png',
	'/imagenes/Juego2.png',
	'/imagenes/Juego3.png',
	'/imagenes/Juego4.png',
];

export function formatCompact(n: number) {
	if (n >= 1_000_000_000) {
		const v = n / 1_000_000_000;
		return `${v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '')}B`;
	}
	if (n >= 1_000_000) {
		const v = n / 1_000_000;
		return `${v >= 100 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '')}M`;
	}
	if (n >= 1_000) {
		const v = n / 1_000;
		return `${v >= 100 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '')}K`;
	}
	return n.toLocaleString('en-US');
}
