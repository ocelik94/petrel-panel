import { db } from '$lib/server/db';
import { isAdmin } from '$lib/server/admin';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	if (!isAdmin(locals.user)) {
		throw error(403, 'Forbidden');
	}

	const nodes = await db.query.node.findMany();

	return { nodes };
};
