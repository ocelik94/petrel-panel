import { db } from '$lib/server/db';
import { server } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;

	const servers = await db.query.server.findMany({
		where: eq(server.ownerId, userId),
		with: {
			node: true,
			egg: true
		}
	});

	return {
		servers,
		serverCount: servers.length
	};
};
