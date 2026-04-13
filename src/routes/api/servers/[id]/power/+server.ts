import { createWingsClient } from '$lib/server/wings';
import { db } from '$lib/server/db';
import { server } from '$lib/server/db/schema';
import type { PowerAction } from '$lib/types';
import { and, eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const VALID_ACTIONS: PowerAction[] = ['start', 'stop', 'restart', 'kill'];

export const POST: RequestHandler = async ({ locals, params, request }) => {
	if (!locals.user) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}

	const body = (await request.json().catch(() => null)) as { action?: PowerAction } | null;
	if (!body?.action || !VALID_ACTIONS.includes(body.action)) {
		return json({ message: 'Invalid power action' }, { status: 400 });
	}

	const serverRecord = await db.query.server.findFirst({
		where: and(eq(server.id, params.id), eq(server.ownerId, locals.user.id)),
		with: {
			node: true
		}
	});

	if (!serverRecord) {
		return json({ message: 'Server not found' }, { status: 404 });
	}

	try {
		const client = createWingsClient(serverRecord.node);
		const response = await client.power(serverRecord.id, body.action);
		return json({ data: response });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Power action failed';
		return json({ message }, { status: 502 });
	}
};
