export async function getRobloxAvatarHeadshot(
	userId: number,
	size = '420x420',
): Promise<string | null> {
	const u = new URL('https://thumbnails.roblox.com/v1/users/avatar-headshot');
	u.searchParams.set('userIds', String(userId));
	u.searchParams.set('size', size);
	u.searchParams.set('format', 'Png');
	u.searchParams.set('isCircular', 'false');

	const r = await fetch(u, { headers: { Accept: 'application/json' } });
	if (!r.ok) return null;

	const j = (await r.json()) as {
		data: { targetId: number; imageUrl?: string; state?: string }[];
	};
	const row = j.data?.find((d) => d.targetId === userId);
	return row?.imageUrl ?? null;
}
