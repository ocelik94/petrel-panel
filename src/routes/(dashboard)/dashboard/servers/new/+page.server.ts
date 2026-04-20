import { db } from '$lib/server/db';
import { server } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	const [nodes, eggs] = await Promise.all([db.query.node.findMany(), db.query.egg.findMany()]);

	return { nodes, eggs };
};

export const actions: Actions = {
	create: async ({ locals, request }) => {
		if (!locals.user) {
			return redirect(302, '/login');
		}

		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim() ?? '';
		const description = formData.get('description')?.toString().trim() || null;
		const nodeId = formData.get('nodeId')?.toString() ?? '';
		const eggId = formData.get('eggId')?.toString() ?? '';
		const dockerImage = formData.get('dockerImage')?.toString().trim() ?? '';
		const startupCommand = formData.get('startupCommand')?.toString().trim() ?? '';
		const memoryLimitRaw = formData.get('memoryLimit')?.toString() ?? '';
		const diskLimitRaw = formData.get('diskLimit')?.toString() ?? '';
		const cpuLimitRaw = formData.get('cpuLimit')?.toString() ?? '100';

		if (!name) return fail(400, { message: 'Name is required' });
		if (!nodeId) return fail(400, { message: 'Node is required' });
		if (!eggId) return fail(400, { message: 'Egg is required' });
		if (!dockerImage) return fail(400, { message: 'Docker image is required' });
		if (!startupCommand) return fail(400, { message: 'Startup command is required' });

		const memoryLimit = parseInt(memoryLimitRaw, 10);
		if (isNaN(memoryLimit) || memoryLimit < 1) {
			return fail(400, { message: 'Memory limit must be a positive number' });
		}

		const diskLimit = parseInt(diskLimitRaw, 10);
		if (isNaN(diskLimit) || diskLimit < 1) {
			return fail(400, { message: 'Disk limit must be a positive number' });
		}

		const cpuLimit = parseInt(cpuLimitRaw, 10) || 100;

		const nodeRecord = await db.query.node.findFirst({
			where: (n, { eq }) => eq(n.id, nodeId)
		});
		if (!nodeRecord) {
			return fail(400, { message: 'Selected node not found' });
		}

		const eggRecord = await db.query.egg.findFirst({
			where: (e, { eq }) => eq(e.id, eggId)
		});
		if (!eggRecord) {
			return fail(400, { message: 'Selected egg not found' });
		}

		const [newServer] = await db
			.insert(server)
			.values({
				name,
				description,
				nodeId,
				eggId,
				dockerImage,
				startupCommand,
				memoryLimit,
				diskLimit,
				cpuLimit,
				ownerId: locals.user.id,
				status: 'installing'
			})
			.returning({ id: server.id });

		return redirect(302, `/dashboard/servers/${newServer.id}`);
	}
};
