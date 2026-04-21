import { db } from '$lib/server/db';
import { egg } from '$lib/server/db/schema';
import { isAdmin } from '$lib/server/admin';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	if (!isAdmin(locals.user)) {
		throw error(403, 'Forbidden');
	}

	return {};
};

export const actions: Actions = {
	create: async ({ locals, request }) => {
		if (!locals.user) {
			return redirect(302, '/login');
		}

		if (!isAdmin(locals.user)) {
			throw error(403, 'Forbidden');
		}

		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim() ?? '';
		const dockerImage = formData.get('dockerImage')?.toString().trim() ?? '';
		const startupCommand = formData.get('startupCommand')?.toString().trim() ?? '';
		const stopCommand = formData.get('stopCommand')?.toString().trim() || 'stop';
		const installScript = formData.get('installScript')?.toString().trim() || null;
		const envVariablesRaw = formData.get('envVariables')?.toString().trim() || null;
		const configFilesRaw = formData.get('configFiles')?.toString().trim() || null;

		if (!name) return fail(400, { message: 'Name is required' });
		if (!dockerImage) return fail(400, { message: 'Docker image is required' });
		if (!startupCommand) return fail(400, { message: 'Startup command is required' });

		let envVariables: unknown = null;
		if (envVariablesRaw) {
			try {
				envVariables = JSON.parse(envVariablesRaw);
			} catch {
				return fail(400, { message: 'Environment variables must be valid JSON' });
			}
		}

		let configFiles: unknown = null;
		if (configFilesRaw) {
			try {
				configFiles = JSON.parse(configFilesRaw);
			} catch {
				return fail(400, { message: 'Config files must be valid JSON' });
			}
		}

		await db.insert(egg).values({
			name,
			dockerImage,
			startupCommand,
			stopCommand,
			installScript,
			envVariables,
			configFiles
		});

		return redirect(302, '/dashboard/eggs');
	}
};
