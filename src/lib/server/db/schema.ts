import {
	boolean,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid
} from 'drizzle-orm/pg-core';

export const serverStatusEnum = pgEnum('server_status', [
	'installing',
	'stopped',
	'starting',
	'running',
	'stopping',
	'error'
]);

export const node = pgTable('node', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull(),
	fqdn: text('fqdn').notNull(),
	port: integer('port').notNull().default(8443),
	scheme: text('scheme').notNull().default('https'),
	daemonToken: text('daemon_token').notNull(),
	memoryTotal: integer('memory_total').notNull(),
	diskTotal: integer('disk_total').notNull(),
	memoryOverallocate: integer('memory_overallocate').notNull().default(0),
	diskOverallocate: integer('disk_overallocate').notNull().default(0),
	isPublic: boolean('is_public').notNull().default(true),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const egg = pgTable('egg', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull(),
	dockerImage: text('docker_image').notNull(),
	startupCommand: text('startup_command').notNull(),
	stopCommand: text('stop_command').notNull().default('stop'),
	configFiles: jsonb('config_files'),
	envVariables: jsonb('env_variables'),
	installScript: text('install_script'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const server = pgTable('server', {
	id: uuid('id').defaultRandom().primaryKey(),
	externalId: text('external_id'),
	name: text('name').notNull(),
	description: text('description'),
	status: serverStatusEnum('status').notNull().default('installing'),
	ownerId: text('owner_id').notNull(),
	nodeId: uuid('node_id')
		.notNull()
		.references(() => node.id),
	eggId: uuid('egg_id')
		.notNull()
		.references(() => egg.id),
	dockerImage: text('docker_image').notNull(),
	startupCommand: text('startup_command').notNull(),
	memoryLimit: integer('memory_limit').notNull(),
	diskLimit: integer('disk_limit').notNull(),
	cpuLimit: integer('cpu_limit').notNull().default(100),
	ioWeight: integer('io_weight').notNull().default(500),
	envVariables: jsonb('env_variables'),
	installedAt: timestamp('installed_at'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const allocation = pgTable('allocation', {
	id: uuid('id').defaultRandom().primaryKey(),
	nodeId: uuid('node_id')
		.notNull()
		.references(() => node.id),
	serverId: uuid('server_id').references(() => server.id),
	ip: text('ip').notNull().default('0.0.0.0'),
	port: integer('port').notNull(),
	isPrimary: boolean('is_primary').notNull().default(false)
});

export const auditLog = pgTable('audit_log', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: text('user_id'),
	serverId: uuid('server_id').references(() => server.id),
	action: text('action').notNull(),
	metadata: jsonb('metadata'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export * from './auth.schema';
