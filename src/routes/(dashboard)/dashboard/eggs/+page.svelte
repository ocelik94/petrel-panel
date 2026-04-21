<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold">Eggs</h1>
		<a
			class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
			href={resolve('/dashboard/eggs/new')}>Add Egg</a
		>
	</div>

	<div class="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
		<table class="w-full text-left text-sm">
			<thead class="bg-slate-900/80 text-slate-400">
				<tr>
					<th class="px-4 py-3 font-medium">Name</th>
					<th class="px-4 py-3 font-medium">Docker Image</th>
					<th class="px-4 py-3 font-medium">Startup Command</th>
					<th class="px-4 py-3 font-medium"></th>
				</tr>
			</thead>
			<tbody>
				{#if data.eggs.length === 0}
					<tr>
						<td class="px-4 py-6 text-slate-400" colspan="4">No eggs found.</td>
					</tr>
				{:else}
					{#each data.eggs as egg (egg.id)}
						<tr class="border-t border-slate-800">
							<td class="px-4 py-3">{egg.name}</td>
							<td class="px-4 py-3 font-mono text-xs text-slate-300">{egg.dockerImage}</td>
							<td class="max-w-xs truncate px-4 py-3 font-mono text-xs text-slate-300"
								>{egg.startupCommand}</td
							>
							<td class="px-4 py-3 text-right">
								<a
									class="text-blue-400 hover:text-blue-300"
									href={resolve(`/dashboard/eggs/${egg.id}`)}>Edit</a
								>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
