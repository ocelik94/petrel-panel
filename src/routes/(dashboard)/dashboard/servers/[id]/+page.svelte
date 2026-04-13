<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import type { PowerAction } from '$lib/types';

	let { data }: { data: PageData } = $props();
	let powerMessage = $state('');
	let powerError = $state('');

	const actions: PowerAction[] = ['start', 'stop', 'restart', 'kill'];

	async function sendPowerAction(action: PowerAction) {
		powerMessage = '';
		powerError = '';

		const response = await fetch(`/api/servers/${data.server.id}/power`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ action })
		});

		if (!response.ok) {
			const payload = (await response.json().catch(() => ({}))) as { message?: string };
			powerError = payload.message ?? 'Power action failed';
			return;
		}

		powerMessage = `Action "${action}" sent.`;
		await invalidateAll();
	}

	const primaryAllocation = $derived(
		data.server.allocations.find((entry) => entry.isPrimary) ?? data.server.allocations[0]
	);
</script>

<div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
	<section class="space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
		<div class="flex items-center justify-between">
			<h1 class="text-xl font-semibold">{data.server.name}</h1>
			<span class="rounded-full bg-slate-700 px-2 py-1 text-xs">{data.server.status}</span>
		</div>

		<div>
			<h2 class="mb-2 text-sm font-semibold tracking-wide text-slate-400 uppercase">
				Power controls
			</h2>
			<div class="flex flex-wrap gap-2">
				{#each actions as action (action)}
					<button
						class="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium capitalize hover:bg-blue-500"
						type="button"
						onclick={() => sendPowerAction(action)}
					>
						{action}
					</button>
				{/each}
			</div>
			{#if powerMessage}
				<p class="mt-2 text-sm text-emerald-400">{powerMessage}</p>
			{/if}
			{#if powerError}
				<p class="mt-2 text-sm text-rose-400">{powerError}</p>
			{/if}
		</div>

		<div>
			<h2 class="mb-2 text-sm font-semibold tracking-wide text-slate-400 uppercase">Console</h2>
			<div
				class="h-72 overflow-y-auto rounded-md border border-slate-800 bg-black/70 p-3 font-mono text-sm text-emerald-300"
			>
				WebSocket console placeholder. Live output will appear here.
			</div>
		</div>
	</section>

	<aside class="space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
		<h2 class="text-sm font-semibold tracking-wide text-slate-400 uppercase">Server info</h2>
		<dl class="space-y-2 text-sm">
			<div class="flex justify-between gap-3">
				<dt class="text-slate-400">Node</dt>
				<dd>{data.server.node.name}</dd>
			</div>
			<div class="flex justify-between gap-3">
				<dt class="text-slate-400">Egg</dt>
				<dd>{data.server.egg.name}</dd>
			</div>
			<div class="flex justify-between gap-3">
				<dt class="text-slate-400">Memory</dt>
				<dd>{data.server.memoryLimit} MB</dd>
			</div>
			<div class="flex justify-between gap-3">
				<dt class="text-slate-400">Disk</dt>
				<dd>{data.server.diskLimit} MB</dd>
			</div>
			<div class="flex justify-between gap-3">
				<dt class="text-slate-400">CPU</dt>
				<dd>{data.server.cpuLimit}%</dd>
			</div>
			<div class="flex justify-between gap-3">
				<dt class="text-slate-400">Allocation</dt>
				<dd>
					{primaryAllocation ? `${primaryAllocation.ip}:${primaryAllocation.port}` : 'Unassigned'}
				</dd>
			</div>
		</dl>
	</aside>
</div>
