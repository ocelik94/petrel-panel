<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold">Nodes</h1>
		<a
			class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
			href={resolve('/dashboard/nodes/new')}>Add Node</a
		>
	</div>

	<div class="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
		<table class="w-full text-left text-sm">
			<thead class="bg-slate-900/80 text-slate-400">
				<tr>
					<th class="px-4 py-3 font-medium">Name</th>
					<th class="px-4 py-3 font-medium">FQDN</th>
					<th class="px-4 py-3 font-medium">Port</th>
					<th class="px-4 py-3 font-medium">Memory (MB)</th>
					<th class="px-4 py-3 font-medium">Disk (MB)</th>
					<th class="px-4 py-3 font-medium"></th>
				</tr>
			</thead>
			<tbody>
				{#if data.nodes.length === 0}
					<tr>
						<td class="px-4 py-6 text-slate-400" colspan="6">No nodes found.</td>
					</tr>
				{:else}
					{#each data.nodes as node (node.id)}
						<tr class="border-t border-slate-800">
							<td class="px-4 py-3">{node.name}</td>
							<td class="px-4 py-3 font-mono text-xs text-slate-300">{node.fqdn}</td>
							<td class="px-4 py-3">{node.port}</td>
							<td class="px-4 py-3">{node.memoryTotal}</td>
							<td class="px-4 py-3">{node.diskTotal}</td>
							<td class="px-4 py-3 text-right">
								<a
									class="text-blue-400 hover:text-blue-300"
									href={resolve(`/dashboard/nodes/${node.id}`)}>Edit</a
								>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
