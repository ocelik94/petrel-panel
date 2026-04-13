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
	<section>
		<h1 class="text-2xl font-semibold">Welcome back</h1>
		<p class="mt-1 text-sm text-slate-400">You currently manage {data.serverCount} server(s).</p>
	</section>

	<section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<div class="rounded-lg border border-slate-800 bg-slate-900 p-4">
			<div class="text-sm text-slate-400">Total servers</div>
			<div class="mt-2 text-2xl font-semibold">{data.serverCount}</div>
		</div>
	</section>

	<section class="rounded-lg border border-slate-800 bg-slate-900">
		<div class="border-b border-slate-800 px-4 py-3 text-sm font-medium">Your servers</div>
		{#if data.servers.length === 0}
			<p class="px-4 py-6 text-sm text-slate-400">No servers yet.</p>
		{:else}
			<ul>
				{#each data.servers as item (item.id)}
					<li
						class="flex items-center justify-between border-t border-slate-800 px-4 py-3 first:border-t-0"
					>
						<div>
							<p class="font-medium">{item.name}</p>
							<p class="text-sm text-slate-400">{item.egg.name} on {item.node.name}</p>
						</div>
						<div class="flex items-center gap-3">
							<span
								class={`rounded-full px-2 py-1 text-xs font-medium ${statusColor[item.status] ?? 'bg-slate-500/20 text-slate-300'}`}
								>{item.status}</span
							>
							<a
								class="text-sm text-blue-400 hover:text-blue-300"
								href={resolve(`/dashboard/servers/${item.id}`)}
							>
								Open
							</a>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</div>
