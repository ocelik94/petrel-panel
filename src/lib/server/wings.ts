import type { FileEntry, PowerAction, WingsServer } from '$lib/types';

type JsonValue = Record<string, unknown>;

export class WingsClient {
	constructor(
		private baseUrl: string,
		private token: string
	) {}

	private async request<T>(path: string, init?: RequestInit): Promise<T> {
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
			return {} as T;
		}

		return (await response.json()) as T;
	}

	async health(): Promise<{ status: string }> {
		return this.request<{ status: string }>('/health');
	}

	async listServers(): Promise<WingsServer[]> {
		const response = await this.request<{ data: WingsServer[] } | WingsServer[]>('/api/servers');
		return Array.isArray(response) ? response : response.data;
	}

	async getFileContents(serverId: string, filePath: string): Promise<FileEntry> {
		const query = new URLSearchParams({ file: filePath }).toString();
		return this.request<FileEntry>(`/api/servers/${serverId}/files/contents?${query}`);
	}

	async writeFile(
		serverId: string,
		filePath: string,
		content: string
	): Promise<{ success: boolean }> {
		return this.request<{ success: boolean }>(`/api/servers/${serverId}/files/write`, {
			method: 'POST',
			body: JSON.stringify({ file: filePath, content })
		});
	}

	async deleteFiles(serverId: string, paths: string[]): Promise<{ success: boolean }> {
		return this.request<{ success: boolean }>(`/api/servers/${serverId}/files/delete`, {
			method: 'POST',
			body: JSON.stringify({ paths })
		});
	}

	async power(serverId: string, action: PowerAction): Promise<JsonValue> {
		return this.request<JsonValue>(`/api/servers/${serverId}/power`, {
			method: 'POST',
			body: JSON.stringify({ action })
		});
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
