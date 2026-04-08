import { createService } from '@khal-os/server-sdk/service';
import type { CreateRequest, DeleteRequest, ListRequest, Note, UpdateRequest } from '../schema';

// In-memory per-user storage: userId -> Note[]
const store = new Map<string, Note[]>();

function getUserNotes(userId: string): Note[] {
	if (!store.has(userId)) {
		store.set(userId, []);
	}
	return store.get(userId)!;
}

createService({
	name: 'notes-service',
	appId: 'notes',
	subscriptions: [
		{
			subject: 'khal.*.notes.list',
			handler: (msg) => {
				const { userId } = msg.json<ListRequest>();
				const notes = getUserNotes(userId);
				msg.respond(JSON.stringify({ notes }));
			},
		},
		{
			subject: 'khal.*.notes.create',
			handler: (msg) => {
				const { userId, title, content } = msg.json<CreateRequest>();
				const now = Date.now();
				const note: Note = {
					id: crypto.randomUUID(),
					title,
					content,
					createdAt: now,
					updatedAt: now,
				};
				getUserNotes(userId).push(note);
				msg.respond(JSON.stringify({ note }));
			},
		},
		{
			subject: 'khal.*.notes.update',
			handler: (msg) => {
				const { userId, noteId, title, content } = msg.json<UpdateRequest>();
				const notes = getUserNotes(userId);
				const note = notes.find((n) => n.id === noteId);
				if (!note) {
					msg.respond(JSON.stringify({ error: 'Note not found' }));
					return;
				}
				if (title !== undefined) note.title = title;
				if (content !== undefined) note.content = content;
				note.updatedAt = Date.now();
				msg.respond(JSON.stringify({ note }));
			},
		},
		{
			subject: 'khal.*.notes.delete',
			handler: (msg) => {
				const { userId, noteId } = msg.json<DeleteRequest>();
				const notes = getUserNotes(userId);
				const idx = notes.findIndex((n) => n.id === noteId);
				if (idx === -1) {
					msg.respond(JSON.stringify({ deleted: false }));
					return;
				}
				notes.splice(idx, 1);
				msg.respond(JSON.stringify({ deleted: true }));
			},
		},
	],
});
