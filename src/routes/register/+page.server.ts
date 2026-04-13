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
	signUpEmail: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString() ?? '';
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		try {
			await auth.api.signUpEmail({
				body: {
					name,
					email,
					password,
					callbackURL: '/dashboard'
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'Registration failed' });
			}

			const message = error instanceof Error ? error.message : 'Unexpected error';
			return fail(500, { message });
		}

		return redirect(302, '/dashboard');
	}
};
