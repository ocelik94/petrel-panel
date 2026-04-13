<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
	<div class="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
		<h1 class="text-2xl font-semibold">Sign in to Petrel Panel</h1>
		<p class="mt-2 text-sm text-slate-400">Manage your game servers from one place.</p>

		<form method="post" action="?/signInEmail" use:enhance class="mt-6 space-y-4">
			<label class="block text-sm">
				<span class="mb-1 block text-slate-300">Email</span>
				<input
					class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
					name="email"
					type="email"
					required
				/>
			</label>
			<label class="block text-sm">
				<span class="mb-1 block text-slate-300">Password</span>
				<input
					class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
					name="password"
					type="password"
					required
				/>
			</label>
			<button
				class="w-full rounded-md bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500"
				type="submit">Sign in</button
			>
		</form>

		<form method="post" action="?/signInSocial" use:enhance class="mt-3">
			<input type="hidden" name="provider" value="github" />
			<button
				class="w-full rounded-md border border-slate-700 px-4 py-2 font-medium hover:bg-slate-800"
				type="submit"
			>
				Continue with GitHub
			</button>
		</form>

		{#if form?.message}
			<p class="mt-3 text-sm text-rose-400">{form.message}</p>
		{/if}

		<p class="mt-6 text-sm text-slate-400">
			Don't have an account?
			<a class="text-blue-400 hover:text-blue-300" href={resolve('/register')}>Create one</a>
		</p>
	</div>
</div>
