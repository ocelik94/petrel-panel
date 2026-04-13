<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();
	let sidebarOpen = $state(false);

	const navItems: Array<{ href: Pathname; label: string }> = [
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/dashboard/servers', label: 'Servers' }
	];

	const adminItems: Array<{ href: Pathname; label: string }> = [
		{ href: '/dashboard/nodes', label: 'Nodes' },
		{ href: '/dashboard/eggs', label: 'Eggs' }
	];
</script>

<div class="min-h-screen bg-slate-950 text-slate-100">
	<div class="flex">
		<aside
			class={`fixed z-30 h-screen w-64 border-r border-slate-800 bg-slate-900 p-4 transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
		>
			<div class="mb-6 text-lg font-semibold text-blue-400">Petrel Panel</div>
			<nav class="space-y-1">
				{#each navItems as item (item.href)}
					<a class="block rounded-md px-3 py-2 text-sm hover:bg-slate-800" href={resolve(item.href)}
						>{item.label}</a
					>
				{/each}
				{#if data.isAdmin}
					<div class="mt-4 px-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
						Admin
					</div>
					{#each adminItems as item (item.href)}
						<a
							class="block rounded-md px-3 py-2 text-sm hover:bg-slate-800"
							href={resolve(item.href)}>{item.label}</a
						>
					{/each}
				{/if}
			</nav>
		</aside>

		<div class="flex min-h-screen flex-1 flex-col lg:ml-0">
			<header
				class="flex items-center justify-between border-b border-slate-800 bg-slate-900/70 px-4 py-3 backdrop-blur"
			>
				<button
					class="rounded-md border border-slate-700 px-3 py-1 text-sm lg:hidden"
					onclick={() => (sidebarOpen = !sidebarOpen)}
				>
					Menu
				</button>
				<div class="text-sm text-slate-300">{data.user.name} ({data.user.email})</div>
				<form method="post" action="/logout">
					<button class="rounded-md bg-slate-800 px-3 py-1 text-sm hover:bg-slate-700" type="submit"
						>Sign out</button
					>
				</form>
			</header>

			<main class="flex-1 p-4 lg:p-6">{@render children()}</main>
		</div>
	</div>
</div>
