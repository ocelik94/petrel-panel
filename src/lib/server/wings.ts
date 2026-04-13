import type { FileEntry, PowerAction, WingsServer } from '$lib/types';

type JsonValue = Record<string, unknown>;

export class WingsClient {
	constructor(
		private baseUrl: string,
		private token: string
	) {}

	private async request<T>(path: string, init?: RequestInit): Promise<T | undefined> {
		const response = await fetch(`${this.baseUrl}${path}`, {
			...init,
			headers: {
				Authorization: `Bearer ${this.token}`,
				'Content-Type': 'application/json',
				...(init?.headers ?? {})
			}
		});

		if (!response.ok) {
			const body = await response.text();
			throw new Error(`Wings request failed (${response.status}): ${body || response.statusText}`);
		}

		if (response.status === 204) {
			return undefined;
		}

		return (await response.json()) as T;
	}

	async health(): Promise<{ status: string }> {
		const response = await this.request<{ status: string }>('/health');
		if (!response) {
			throw new Error('Wings health endpoint returned no data');
		}

		return response;
	}

	async listServers(): Promise<WingsServer[]> {
		const response = await this.request<{ data: WingsServer[] } | WingsServer[]>('/api/servers');
		if (!response) {
			return [];
		}

		return Array.isArray(response) ? response : response.data;
	}

	async getFileContents(serverId: string, filePath: string): Promise<FileEntry> {
		const query = new URLSearchParams({ file: filePath }).toString();
		const response = await this.request<FileEntry>(
			`/api/servers/${serverId}/files/contents?${query}`
		);
		if (!response) {
			throw new Error('Wings file contents endpoint returned no data');
		}

		return response;
	}

	async writeFile(
		serverId: string,
		filePath: string,
		content: string
	): Promise<{ success: boolean }> {
		const response = await this.request<{ success: boolean }>(
			`/api/servers/${serverId}/files/write`,
			{
				method: 'POST',
				body: JSON.stringify({ file: filePath, content })
			}
		);

		return response ?? { success: true };
	}

	async deleteFiles(serverId: string, paths: string[]): Promise<{ success: boolean }> {
		const response = await this.request<{ success: boolean }>(
			`/api/servers/${serverId}/files/delete`,
			{
				method: 'POST',
				body: JSON.stringify({ paths })
			}
		);

		return response ?? { success: true };
	}

	async power(serverId: string, action: PowerAction): Promise<JsonValue> {
		return (
			(await this.request<JsonValue>(`/api/servers/${serverId}/power`, {
				method: 'POST',
				body: JSON.stringify({ action })
			})) ?? {}
		);
	}
}

export function createWingsClient(node: {
	scheme: string;
	fqdn: string;
	port: number;
	daemonToken: string;
}): WingsClient {
	return new WingsClient(`${node.scheme}://${node.fqdn}:${node.port}`, node.daemonToken);
}
