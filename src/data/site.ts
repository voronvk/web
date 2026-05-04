export const projectPlaceholderImage =
	'https://r2.fivemanage.com/6NQ840l30BWj9rij5CfY2/Roblox/project.png';

export function getRobloxGroupId(): number {
	const raw = import.meta.env.PUBLIC_ROBLOX_GROUP_ID;
	if (raw === undefined || raw === '') return 442873166;
	const n = Number(raw);
	return Number.isFinite(n) && n > 0 ? n : 442873166;
}

export const liveStats = {
	totalPlayers: 21131,
	totalVisits: 888120256,
};

export type GameEntry = {
	id: number;
	name: string;
	playing: number;
	visits: number;
	thumbnailUrl: string;
	robloxGameLink: string;
	featured: boolean;
};

export const heroBannerThumbnails: string[] = Array.from({ length: 16 }, () => projectPlaceholderImage);

export const partners = ['Roblox', 'Creators', 'Brands', 'Studios', 'Live Ops'];

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
