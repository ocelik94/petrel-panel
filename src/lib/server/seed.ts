import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';
import { auth } from '$lib/server/auth';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

export async function seedDefaultAdmin() {
	if (env.SEED_DEFAULT_ADMIN !== 'true') {
		return;
	}

	try {
		const existing = await db.select().from(user).where(eq(user.email, 'admin@admin.com'));

		if (existing.length > 0) {
			console.log('Default admin user already exists, skipping seed');
			return;
		}

		await auth.api.signUpEmail({
			body: { name: 'Admin', email: 'admin@admin.com', password: 'admin' }
		});

		console.log('Default admin user created (admin@admin.com / admin)');
	} catch (err) {
		console.error('Failed to seed default admin user:', err);
	}
}
