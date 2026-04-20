<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<a class="text-slate-400 hover:text-slate-200" href={resolve('/dashboard/eggs')}>← Eggs</a>
		<h1 class="text-2xl font-semibold">Add Egg</h1>
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
					placeholder="Minecraft Java"
					required
					type="text"
				/>
			</div>

			<div>
				<label class="mb-1 block text-sm text-slate-300" for="dockerImage">Docker Image</label>
				<input
					class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
					id="dockerImage"
					name="dockerImage"
					placeholder="itzg/minecraft-server:latest"
					required
					type="text"
				/>
			</div>

			<div>
				<label class="mb-1 block text-sm text-slate-300" for="startupCommand">Startup Command</label
				>
				<input
					class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
					id="startupCommand"
					name="startupCommand"
					required
					type="text"
				/>
			</div>

			<div>
				<label class="mb-1 block text-sm text-slate-300" for="stopCommand">Stop Command</label>
				<input
					class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
					id="stopCommand"
					name="stopCommand"
					type="text"
					value="stop"
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
					rows="4"
				></textarea>
			</div>

			<div>
				<label class="mb-1 block text-sm text-slate-300" for="envVariables"
					>Environment Variables <span class="text-slate-500">(optional, JSON)</span></label
				>
				<textarea
					class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
					id="envVariables"
					name="envVariables"
					placeholder={'{"EULA": "TRUE"}'}
					rows="3"
				></textarea>
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
				></textarea>
			</div>

			<button
				class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
				type="submit">Create Egg</button
			>
		</form>
	</div>
</div>
