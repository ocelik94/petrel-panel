import { db } from '$lib/server/db';
import { server } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	const serverRecord = await db.query.server.findFirst({
		where: and(eq(server.id, params.id), eq(server.ownerId, locals.user.id)),
		with: {
			node: true,
			egg: true,
			allocations: true
		}
	});

	if (!serverRecord) {
		throw error(404, 'Server not found');
	}

	return { server: serverRecord };
};
