<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let selectedEggId = $state('');
	let dockerImage = $state('');
	let startupCommand = $state('');

	function onEggChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		selectedEggId = select.value;
		const egg = data.eggs.find((e) => e.id === selectedEggId);
		if (egg) {
			dockerImage = egg.dockerImage;
			startupCommand = egg.startupCommand;
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<a class="text-slate-400 hover:text-slate-200" href={resolve('/dashboard/servers')}>← Servers</a
		>
		<h1 class="text-2xl font-semibold">Create Server</h1>
	</div>

	<div class="max-w-xl rounded-lg border border-slate-800 bg-slate-900 p-6">
		{#if form?.message}
			<p class="mb-4 text-sm text-rose-400">{form.message}</p>
		{/if}

		<form method="POST" action="?/create" use:enhance class="space-y-4">
			<div>
				<label class="mb-1 block text-sm text-slate-300" for="name">Name</label>
				<input
					class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
					id="name"
					name="name"
					required
					type="text"
				/>
			</div>

			<div>
				<label class="mb-1 block text-sm text-slate-300" for="description"
					>Description <span class="text-slate-500">(optional)</span></label
				>
				<textarea
					class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
					id="description"
					name="description"
					rows="2"
				></textarea>
			</div>

			<div>
				<label class="mb-1 block text-sm text-slate-300" for="nodeId">Node</label>
				<select
					class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
					id="nodeId"
					name="nodeId"
					required
				>
					<option value="">Select a node…</option>
					{#each data.nodes as node (node.id)}
						<option value={node.id}>{node.name} ({node.fqdn})</option>
					{/each}
				</select>
			</div>

			<div>
				<label class="mb-1 block text-sm text-slate-300" for="eggId">Game / Egg</label>
				<select
					class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
					id="eggId"
					name="eggId"
					onchange={onEggChange}
					required
				>
					<option value="">Select an egg…</option>
					{#each data.eggs as egg (egg.id)}
						<option value={egg.id}>{egg.name}</option>
					{/each}
				</select>
			</div>

			<div>
				<label class="mb-1 block text-sm text-slate-300" for="dockerImage">Docker Image</label>
				<input
					bind:value={dockerImage}
					class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
					id="dockerImage"
					name="dockerImage"
					required
					type="text"
				/>
			</div>

			<div>
				<label class="mb-1 block text-sm text-slate-300" for="startupCommand">Startup Command</label
				>
				<input
					bind:value={startupCommand}
					class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
					id="startupCommand"
					name="startupCommand"
					required
					type="text"
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="mb-1 block text-sm text-slate-300" for="memoryLimit"
						>Memory Limit (MB)</label
					>
					<input
						class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
						id="memoryLimit"
						min="1"
						name="memoryLimit"
						required
						type="number"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm text-slate-300" for="diskLimit">Disk Limit (MB)</label>
					<input
						class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
						id="diskLimit"
						min="1"
						name="diskLimit"
						required
						type="number"
					/>
				</div>
			</div>

			<div>
				<label class="mb-1 block text-sm text-slate-300" for="cpuLimit">CPU Limit (%)</label>
				<input
					class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
					id="cpuLimit"
					min="1"
					name="cpuLimit"
					type="number"
					value="100"
				/>
			</div>

			<button
				class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
				type="submit">Create Server</button
			>
		</form>
	</div>
</div>
