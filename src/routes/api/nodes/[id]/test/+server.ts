import { db } from '$lib/server/db';
import { node } from '$lib/server/db/schema';
import { isAdmin } from '$lib/server/admin';
import { createWingsClient } from '$lib/server/wings';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		return json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
	}

	if (!isAdmin(locals.user)) {
		return json({ status: 'error', message: 'Forbidden' }, { status: 403 });
	}

	const nodeRecord = await db.query.node.findFirst({
		where: eq(node.id, params.id)
	});

	if (!nodeRecord) {
		return json({ status: 'error', message: 'Node not found' }, { status: 404 });
	}

	try {
		const client = createWingsClient(nodeRecord);
		await client.health();
		return json({ status: 'ok' });
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		return json({ status: 'error', message }, { status: 503 });
	}
};
