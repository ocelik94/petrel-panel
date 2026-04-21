<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let daemonToken = $state(data.node.daemonToken);
	let deleteConfirm = $state(false);
	let testStatus = $state<'idle' | 'testing' | 'ok' | 'error'>('idle');
	let testMessage = $state('');

	async function testConnection() {
		testStatus = 'testing';
		testMessage = '';
		try {
			const res = await fetch(`/api/nodes/${data.node.id}/test`, { method: 'POST' });
			const json = (await res.json()) as { status: string; message?: string };
			if (json.status === 'ok') {
				testStatus = 'ok';
				testMessage = 'Connection successful';
			} else {
				testStatus = 'error';
				testMessage = json.message ?? 'Connection failed';
			}
		} catch {
			testStatus = 'error';
			testMessage = 'Request failed';
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<a class="text-slate-400 hover:text-slate-200" href={resolve('/dashboard/nodes')}>← Nodes</a>
		<h1 class="text-2xl font-semibold">{data.node.name}</h1>
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
						value={data.node.name}
					/>
				</div>

				<div>
					<label class="mb-1 block text-sm text-slate-300" for="fqdn">FQDN / IP</label>
					<input
						class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
						id="fqdn"
						name="fqdn"
						required
						type="text"
						value={data.node.fqdn}
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
							value={data.node.port}
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm text-slate-300" for="scheme">Scheme</label>
						<select
							class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
							id="scheme"
							name="scheme"
						>
							<option selected={data.node.scheme === 'https'} value="https">https</option>
							<option selected={data.node.scheme === 'http'} value="http">http</option>
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
							value={data.node.memoryTotal}
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
							value={data.node.diskTotal}
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
							value={data.node.memoryOverallocate}
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
							value={data.node.diskOverallocate}
						/>
					</div>
				</div>

				<div class="flex items-center gap-2">
					<input
						checked={data.node.isPublic}
						class="h-4 w-4 rounded border-slate-700 bg-slate-950"
						id="isPublic"
						name="isPublic"
						type="checkbox"
					/>
					<label class="text-sm text-slate-300" for="isPublic">Public</label>
				</div>

				<div class="flex gap-3">
					<button
						class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
						type="submit">Save Changes</button
					>
					<button
						class="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-600"
						onclick={testConnection}
						type="button"
					>
						{testStatus === 'testing' ? 'Testing…' : 'Test Connection'}
					</button>
					{#if testStatus === 'ok'}
						<span class="self-center text-sm text-emerald-400">{testMessage}</span>
					{:else if testStatus === 'error'}
						<span class="self-center text-sm text-rose-400">{testMessage}</span>
					{/if}
				</div>
			</form>
		</div>

		<aside class="space-y-6">
			<div class="rounded-lg border border-slate-800 bg-slate-900 p-4">
				<h2 class="mb-3 text-sm font-semibold tracking-wide text-slate-400 uppercase">
					Assigned Servers ({data.node.servers.length})
				</h2>
				{#if data.node.servers.length === 0}
					<p class="text-sm text-slate-400">No servers assigned.</p>
				{:else}
					<ul class="space-y-1">
						{#each data.node.servers as s (s.id)}
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
				{#if data.node.servers.length > 0}
					<p class="text-sm text-slate-400">
						Cannot delete this node while servers are assigned to it.
					</p>
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
						type="button">Delete Node</button
					>
				{/if}
			</div>
		</aside>
	</div>
</div>
