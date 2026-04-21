<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let deleteConfirm = $state(false);
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<a class="text-slate-400 hover:text-slate-200" href={resolve('/dashboard/eggs')}>← Eggs</a>
		<h1 class="text-2xl font-semibold">{data.egg.name}</h1>
	</div>

	<div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
		<div class="rounded-lg border border-slate-800 bg-slate-900 p-6">
			{#if form?.message}
				<p class="mb-4 text-sm {form.success ? 'text-emerald-400' : 'text-rose-400'}">
					{form.message}
				</p>
			{/if}
			{#if form?.success && !form.message}
				<p class="mb-4 text-sm text-emerald-400">Changes saved.</p>
			{/if}

			<form method="POST" action="?/update" use:enhance class="space-y-4">
				<div>
					<label class="mb-1 block text-sm text-slate-300" for="name">Name</label>
					<input
						class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
						id="name"
						name="name"
						required
						type="text"
						value={data.egg.name}
					/>
				</div>

				<div>
					<label class="mb-1 block text-sm text-slate-300" for="dockerImage">Docker Image</label>
					<input
						class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
						id="dockerImage"
						name="dockerImage"
						required
						type="text"
						value={data.egg.dockerImage}
					/>
				</div>

				<div>
					<label class="mb-1 block text-sm text-slate-300" for="startupCommand"
						>Startup Command</label
					>
					<input
						class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
						id="startupCommand"
						name="startupCommand"
						required
						type="text"
						value={data.egg.startupCommand}
					/>
				</div>

				<div>
					<label class="mb-1 block text-sm text-slate-300" for="stopCommand">Stop Command</label>
					<input
						class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
						id="stopCommand"
						name="stopCommand"
						type="text"
						value={data.egg.stopCommand}
					/>
				</div>

				<div>
					<label class="mb-1 block text-sm text-slate-300" for="installScript"
						>Install Script <span class="text-slate-500">(optional)</span></label
					>
					<textarea
						class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
						id="installScript"
						name="installScript"
						rows="4">{data.egg.installScript ?? ''}</textarea
					>
				</div>

				<div>
					<label class="mb-1 block text-sm text-slate-300" for="envVariables"
						>Environment Variables <span class="text-slate-500">(optional, JSON)</span></label
					>
					<textarea
						class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
						id="envVariables"
						name="envVariables"
						rows="3"
						>{data.egg.envVariables ? JSON.stringify(data.egg.envVariables, null, 2) : ''}</textarea
					>
				</div>

				<div>
					<label class="mb-1 block text-sm text-slate-300" for="configFiles"
						>Config Files <span class="text-slate-500">(optional, JSON)</span></label
					>
					<textarea
						class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
						id="configFiles"
						name="configFiles"
						rows="3"
						>{data.egg.configFiles ? JSON.stringify(data.egg.configFiles, null, 2) : ''}</textarea
					>
				</div>

				<button
					class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
					type="submit">Save Changes</button
				>
			</form>
		</div>

		<aside class="space-y-6">
			<div class="rounded-lg border border-slate-800 bg-slate-900 p-4">
				<h2 class="mb-3 text-sm font-semibold tracking-wide text-slate-400 uppercase">
					Servers using this egg ({data.egg.servers.length})
				</h2>
				{#if data.egg.servers.length === 0}
					<p class="text-sm text-slate-400">No servers using this egg.</p>
				{:else}
					<ul class="space-y-1">
						{#each data.egg.servers as s (s.id)}
							<li>
								<a
									class="text-sm text-blue-400 hover:text-blue-300"
									href={resolve(`/dashboard/servers/${s.id}`)}>{s.name}</a
								>
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			<div class="rounded-lg border border-rose-900/40 bg-slate-900 p-4">
				<h2 class="mb-3 text-sm font-semibold tracking-wide text-rose-400 uppercase">
					Danger Zone
				</h2>
				{#if data.egg.servers.length > 0}
					<p class="text-sm text-slate-400">Cannot delete this egg while servers are using it.</p>
				{:else if deleteConfirm}
					<p class="mb-3 text-sm text-slate-300">Are you sure? This action cannot be undone.</p>
					<form method="POST" action="?/delete" use:enhance class="flex gap-2">
						<button
							class="rounded-md bg-rose-600 px-3 py-2 text-sm font-medium hover:bg-rose-500"
							type="submit">Confirm Delete</button
						>
						<button
							class="rounded-md bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
							onclick={() => (deleteConfirm = false)}
							type="button">Cancel</button
						>
					</form>
				{:else}
					<button
						class="rounded-md bg-rose-600 px-3 py-2 text-sm font-medium hover:bg-rose-500"
						onclick={() => (deleteConfirm = true)}
						type="button">Delete Egg</button
					>
				{/if}
			</div>
		</aside>
	</div>
</div>
