import { env } from '$env/dynamic/private';

const adminEmails = new Set(
	(env.ADMIN_EMAILS ?? '')
		.split(',')
		.map((entry) => entry.trim().toLowerCase())
		.filter(Boolean)
);

export function isAdmin(user: { email?: string | null } | undefined): boolean {
	return Boolean(user?.email && adminEmails.has(user.email.toLowerCase()));
}
