import { db } from '$lib/server/db';
import { server } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}

	const servers = await db.query.server.findMany({
		where: eq(server.ownerId, locals.user.id),
		with: {
			node: true,
			egg: true,
			allocations: true
		}
	});

	return json({ data: servers });
};
