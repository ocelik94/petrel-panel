import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) {
		return redirect(302, '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	signInEmail: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		try {
			await auth.api.signInEmail({
				body: {
					email,
					password,
					callbackURL: '/dashboard'
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'Login failed' });
			}

			const message = error instanceof Error ? error.message : 'Unexpected error';
			return fail(500, { message });
		}

		return redirect(302, '/dashboard');
	},
	signInSocial: async ({ request }) => {
		const formData = await request.formData();
		const provider = (formData.get('provider')?.toString() ?? 'github') as 'github';

		try {
			const result = await auth.api.signInSocial({
				body: {
					provider,
					callbackURL: '/dashboard'
				}
			});

			if (!result?.url) {
				return fail(400, { message: 'GitHub sign-in failed — no redirect URL returned' });
			}

			return redirect(302, result.url);
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'GitHub sign-in failed' });
			}

			return fail(500, { message: 'Unexpected error during GitHub sign-in' });
		}
	}
};
