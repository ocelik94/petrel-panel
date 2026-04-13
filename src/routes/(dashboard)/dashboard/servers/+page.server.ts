import { db } from '$lib/server/db';
import { server } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const servers = await db.query.server.findMany({
		where: eq(server.ownerId, locals.user!.id),
		with: {
			node: true,
			egg: true
		}
	});

	return { servers };
};
