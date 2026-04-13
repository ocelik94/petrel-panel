export type ServerStatus = 'installing' | 'stopped' | 'starting' | 'running' | 'stopping' | 'error';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

export interface Node {
	id: string;
	name: string;
	fqdn: string;
	port: number;
	scheme: string;
	daemonToken: string;
	memoryTotal: number;
	diskTotal: number;
	memoryOverallocate: number;
	diskOverallocate: number;
	isPublic: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface Egg {
	id: string;
	name: string;
	dockerImage: string;
	startupCommand: string;
	stopCommand: string;
	configFiles: unknown | null;
	envVariables: unknown | null;
	installScript: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface Server {
	id: string;
	externalId: string | null;
	name: string;
	description: string | null;
	status: ServerStatus;
	ownerId: string;
	nodeId: string;
	eggId: string;
	dockerImage: string;
	startupCommand: string;
	memoryLimit: number;
	diskLimit: number;
	cpuLimit: number;
	ioWeight: number;
	envVariables: unknown | null;
	installedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface Allocation {
	id: string;
	nodeId: string;
	serverId: string | null;
	ip: string;
	port: number;
	isPrimary: boolean;
}

export interface AuditLog {
	id: string;
	userId: string | null;
	serverId: string | null;
	action: string;
	metadata: unknown | null;
	createdAt: Date;
}

export interface WingsServer {
	uuid: string;
	name: string;
	state: string;
	memory_limit?: number;
	disk_limit?: number;
	cpu_limit?: number;
}

export interface ResourceUsage {
	memoryBytes: number;
	diskBytes: number;
	cpuAbsolute: number;
	networkRxBytes: number;
	networkTxBytes: number;
}

export interface FileEntry {
	name: string;
	path: string;
	isFile: boolean;
	size?: number;
	content?: string;
}

export interface CreateServerRequest {
	name: string;
	nodeId: string;
	eggId: string;
	dockerImage: string;
	startupCommand: string;
	memoryLimit: number;
	diskLimit: number;
	cpuLimit?: number;
	ioWeight?: number;
	envVariables?: Record<string, string>;
	externalId?: string;
	description?: string;
}
