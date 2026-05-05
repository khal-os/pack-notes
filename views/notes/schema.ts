import { type Static, Type } from '@sinclair/typebox';

// --- Note entity ---

export const Note = Type.Object({
	id: Type.String(),
	title: Type.String(),
	content: Type.String(),
	createdAt: Type.Number(),
	updatedAt: Type.Number(),
});
export type Note = Static<typeof Note>;

// --- List ---

export const ListRequest = Type.Object({
	userId: Type.String(),
});
export type ListRequest = Static<typeof ListRequest>;

export const ListResponse = Type.Object({
	notes: Type.Array(Note),
});
export type ListResponse = Static<typeof ListResponse>;

// --- Create ---

export const CreateRequest = Type.Object({
	userId: Type.String(),
	title: Type.String(),
	content: Type.String(),
});
export type CreateRequest = Static<typeof CreateRequest>;

export const CreateResponse = Type.Object({
	note: Note,
});
export type CreateResponse = Static<typeof CreateResponse>;

// --- Update ---

export const UpdateRequest = Type.Object({
	userId: Type.String(),
	noteId: Type.String(),
	title: Type.Optional(Type.String()),
	content: Type.Optional(Type.String()),
});
export type UpdateRequest = Static<typeof UpdateRequest>;

export const UpdateResponse = Type.Object({
	note: Note,
});
export type UpdateResponse = Static<typeof UpdateResponse>;

// --- Delete ---

export const DeleteRequest = Type.Object({
	userId: Type.String(),
	noteId: Type.String(),
});
export type DeleteRequest = Static<typeof DeleteRequest>;

export const DeleteResponse = Type.Object({
	deleted: Type.Boolean(),
});
export type DeleteResponse = Static<typeof DeleteResponse>;
