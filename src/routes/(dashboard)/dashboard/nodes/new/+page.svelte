<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let daemonToken = $state(crypto.randomUUID());
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<a class="text-slate-400 hover:text-slate-200" href={resolve('/dashboard/nodes')}>← Nodes</a>
		<h1 class="text-2xl font-semibold">Add Node</h1>
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
				<label class="mb-1 block text-sm text-slate-300" for="fqdn">FQDN / IP</label>
				<input
					class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
					id="fqdn"
					name="fqdn"
					placeholder="node1.example.com"
					required
					type="text"
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="mb-1 block text-sm text-slate-300" for="port">Port</label>
					<input
						class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
						id="port"
						name="port"
						required
						type="number"
						value="8443"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm text-slate-300" for="scheme">Scheme</label>
					<select
						class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
						id="scheme"
						name="scheme"
					>
						<option value="https">https</option>
						<option value="http">http</option>
					</select>
				</div>
			</div>

			<div>
				<label class="mb-1 block text-sm text-slate-300" for="daemonToken">Daemon Token</label>
				<div class="flex gap-2">
					<input
						bind:value={daemonToken}
						class="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
						id="daemonToken"
						name="daemonToken"
						required
						type="text"
					/>
					<button
						class="rounded-md bg-slate-700 px-3 py-2 text-sm hover:bg-slate-600"
						onclick={() => (daemonToken = crypto.randomUUID())}
						type="button">Generate</button
					>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="mb-1 block text-sm text-slate-300" for="memoryTotal"
						>Total Memory (MB)</label
					>
					<input
						class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
						id="memoryTotal"
						min="1"
						name="memoryTotal"
						required
						type="number"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm text-slate-300" for="diskTotal">Total Disk (MB)</label>
					<input
						class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
						id="diskTotal"
						min="1"
						name="diskTotal"
						required
						type="number"
					/>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="mb-1 block text-sm text-slate-300" for="memoryOverallocate"
						>Memory Overallocate (%)</label
					>
					<input
						class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
						id="memoryOverallocate"
						min="0"
						name="memoryOverallocate"
						type="number"
						value="0"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm text-slate-300" for="diskOverallocate"
						>Disk Overallocate (%)</label
					>
					<input
						class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
						id="diskOverallocate"
						min="0"
						name="diskOverallocate"
						type="number"
						value="0"
					/>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<input
					checked
					class="h-4 w-4 rounded border-slate-700 bg-slate-950"
					id="isPublic"
					name="isPublic"
					type="checkbox"
				/>
				<label class="text-sm text-slate-300" for="isPublic">Public</label>
			</div>

			<button
				class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
				type="submit">Create Node</button
			>
		</form>
	</div>
</div>
