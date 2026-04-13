import { db } from '$lib/server/db';
import { server } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	const servers = await db.query.server.findMany({
		where: eq(server.ownerId, locals.user.id),
		with: {
			node: true,
			egg: true
		}
	});

	return { servers };
};
