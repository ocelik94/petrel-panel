import { relations } from 'drizzle-orm';
import { allocation, auditLog, egg, node, server } from './schema';

export const nodeRelations = relations(node, ({ many }) => ({
	servers: many(server),
	allocations: many(allocation)
}));

export const eggRelations = relations(egg, ({ many }) => ({
	servers: many(server)
}));

export const serverRelations = relations(server, ({ one, many }) => ({
	node: one(node, {
		fields: [server.nodeId],
		references: [node.id]
	}),
	egg: one(egg, {
		fields: [server.eggId],
		references: [egg.id]
	}),
	allocations: many(allocation),
	auditLogs: many(auditLog)
}));

export const allocationRelations = relations(allocation, ({ one }) => ({
	node: one(node, {
		fields: [allocation.nodeId],
		references: [node.id]
	}),
	server: one(server, {
		fields: [allocation.serverId],
		references: [server.id]
	})
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
	server: one(server, {
		fields: [auditLog.serverId],
		references: [server.id]
	})
}));
