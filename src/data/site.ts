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
	{
		placeId: 128740661033853,
		gameUrl: 'https://www.roblox.com/games/128740661033853/Dodge-the-Lasers',
		name: 'Dodge the Lasers!',
	},
];

export const heroBannerThumbnails: string[] = [
	'/imagenes/Juego1.png',
	'/imagenes/Juego2.png',
	'/imagenes/Juego3.png',
	'/imagenes/Juego4.png',
	'/imagenes/Juego5.png',
	'/imagenes/Juego6.png',
];

export type SocialLink = {
	label: string;
	href: string;
	icon: 'x' | 'tiktok';
};

export const socialLinks: readonly SocialLink[] = [
	{ label: 'X', href: 'https://x.com', icon: 'x' },
	{ label: 'TikTok', href: 'https://www.tiktok.com/@voronvk', icon: 'tiktok' },
];

/** Edita este bloque para personalizar la sección About me. */
export const aboutMe = {
	robloxUserId: 1395575840,
	robloxProfileUrl: 'https://www.roblox.com/users/1395575840/profile',
	photoAlt: 'Voron on Roblox',
	eyebrow: 'About me',
	title: 'From big studios to my own games',
	paragraphs: [
		"I'm Voron, 18 years old and a Roblox developer whose work is valued at six figures in portfolio and project evaluations. For a long time I worked with large studios on live experiences, learning how hit games are built, shipped, and run at scale.",
		"Now I'm focused on Voron Creations: my own label where I design and publish the incrementals and sims I want to play. This site is the home for those projects, with live stats, links, and everything I'm building next.",
	],
	highlights: [
		{
			title: 'Six-figure valuation',
			description:
				'Evaluations place my portfolio above six figures. A proven track record in studio and independent development.',
		},
		{
			title: 'Studio background',
			description:
				'Worked with major teams before going independent: systems, retention, and live ops.',
		},
		{
			title: 'Voron Creations',
			description:
				'My own games, my own pace. Incrementals and experiences built for the long run.',
		},
	],
};

export type WorkStatus = 'in-development' | 'prototype' | 'coming-soon';

export type CurrentWorkItem = {
	title: string;
	status: WorkStatus;
	description: string;
	imageSrc?: string;
};

/** Edita este bloque para proyectos en desarrollo (WIP, no publicados en Roblox). */
export const currentWork = {
	eyebrow: 'Now',
	title: "What I'm working on",
	intro: 'Projects in active development. Not live on Roblox yet.',
	items: [
		{
			title: 'Ever Green Game',
			status: 'in-development',
			description: 'Fast paced, mini-game creative game.',
			imageSrc: '/imagenes/wip-1.png',
		},
		{
			title: 'Tank Game',
			status: 'prototype',
			description: 'Trying new ideas, looking around it.',
			imageSrc: '/imagenes/wip-2.png',
		},
	] satisfies CurrentWorkItem[],
};

export const workStatusLabels: Record<WorkStatus, string> = {
	'in-development': 'In development',
	prototype: 'Prototype',
	'coming-soon': 'Coming soon',
};

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
