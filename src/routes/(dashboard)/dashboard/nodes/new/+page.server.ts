import { db } from '$lib/server/db';
import { node } from '$lib/server/db/schema';
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
		const fqdn = formData.get('fqdn')?.toString().trim() ?? '';
		const portRaw = formData.get('port')?.toString() ?? '8443';
		const scheme = formData.get('scheme')?.toString() ?? 'https';
		const daemonToken = formData.get('daemonToken')?.toString().trim() || crypto.randomUUID();
		const memoryTotalRaw = formData.get('memoryTotal')?.toString() ?? '';
		const diskTotalRaw = formData.get('diskTotal')?.toString() ?? '';
		const memoryOverallocateRaw = formData.get('memoryOverallocate')?.toString() ?? '0';
		const diskOverallocateRaw = formData.get('diskOverallocate')?.toString() ?? '0';
		const isPublic = formData.get('isPublic') === 'on';

		if (!name) return fail(400, { message: 'Name is required' });
		if (!fqdn) return fail(400, { message: 'FQDN is required' });

		const port = parseInt(portRaw, 10);
		if (isNaN(port) || port < 1 || port > 65535) {
			return fail(400, { message: 'Port must be a valid number between 1 and 65535' });
		}

		const memoryTotal = parseInt(memoryTotalRaw, 10);
		if (isNaN(memoryTotal) || memoryTotal < 1) {
			return fail(400, { message: 'Memory total must be a positive number' });
		}

		const diskTotal = parseInt(diskTotalRaw, 10);
		if (isNaN(diskTotal) || diskTotal < 1) {
			return fail(400, { message: 'Disk total must be a positive number' });
		}

		const memoryOverallocate = parseInt(memoryOverallocateRaw, 10) || 0;
		const diskOverallocate = parseInt(diskOverallocateRaw, 10) || 0;

		await db.insert(node).values({
			name,
			fqdn,
			port,
			scheme,
			daemonToken,
			memoryTotal,
			diskTotal,
			memoryOverallocate,
			diskOverallocate,
			isPublic
		});

		return redirect(302, '/dashboard/nodes');
	}
};
