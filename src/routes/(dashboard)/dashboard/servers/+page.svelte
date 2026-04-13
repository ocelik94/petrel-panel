<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const statusColor: Record<string, string> = {
		installing: 'bg-amber-500/20 text-amber-300',
		stopped: 'bg-slate-500/20 text-slate-300',
		starting: 'bg-cyan-500/20 text-cyan-300',
		running: 'bg-emerald-500/20 text-emerald-300',
		stopping: 'bg-orange-500/20 text-orange-300',
		error: 'bg-rose-500/20 text-rose-300'
	};
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold">Servers</h1>
		<button
			class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
			type="button">Create Server</button
		>
	</div>

	<div class="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
		<table class="w-full text-left text-sm">
			<thead class="bg-slate-900/80 text-slate-400">
				<tr>
					<th class="px-4 py-3 font-medium">Name</th>
					<th class="px-4 py-3 font-medium">Status</th>
					<th class="px-4 py-3 font-medium">Node</th>
					<th class="px-4 py-3 font-medium">Game</th>
					<th class="px-4 py-3 font-medium"></th>
				</tr>
			</thead>
			<tbody>
				{#if data.servers.length === 0}
					<tr>
						<td class="px-4 py-6 text-slate-400" colspan="5">No servers found.</td>
					</tr>
				{:else}
					{#each data.servers as item (item.id)}
						<tr class="border-t border-slate-800">
							<td class="px-4 py-3">{item.name}</td>
							<td class="px-4 py-3">
								<span
									class={`rounded-full px-2 py-1 text-xs font-medium ${statusColor[item.status] ?? 'bg-slate-500/20 text-slate-300'}`}
									>{item.status}</span
								>
							</td>
							<td class="px-4 py-3">{item.node.name}</td>
							<td class="px-4 py-3">{item.egg.name}</td>
							<td class="px-4 py-3 text-right">
								<a
									class="text-blue-400 hover:text-blue-300"
									href={resolve(`/dashboard/servers/${item.id}`)}>Open</a
								>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
