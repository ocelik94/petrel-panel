import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		await db.execute(sql`SELECT 1`);
		return json({ status: 'ok', timestamp: new Date().toISOString() });
	} catch {
		return json({ status: 'error', message: 'Database unreachable' }, { status: 503 });
	}
};
