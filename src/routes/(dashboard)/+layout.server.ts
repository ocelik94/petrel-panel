import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const adminEmails = new Set(
	(env.ADMIN_EMAILS ?? '')
		.split(',')
		.map((entry) => entry.trim().toLowerCase())
		.filter(Boolean)
);

export const load: LayoutServerLoad = ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	return {
		user: locals.user,
		isAdmin: Boolean(locals.user.email && adminEmails.has(locals.user.email.toLowerCase()))
	};
};
