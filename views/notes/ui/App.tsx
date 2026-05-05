'use client';

import { useNats, useKhalAuth } from '@khal-os/sdk/app';
import { Button, GlassCard, Input } from '@khal-os/ui';
import { useCallback, useEffect, useState } from 'react';
import { SUBJECTS } from '../subjects';
import type { Note } from '../schema';

interface AppComponentProps {
	windowId: string;
	meta?: Record<string, unknown>;
}

type EditingNote = { id: string; title: string; content: string } | null;

export function NotesApp({ windowId }: AppComponentProps) {
	const { request, connected, orgId, userId } = useNats();
	const auth = useKhalAuth();
	const currentUserId = auth?.userId ?? userId;

	const [notes, setNotes] = useState<Note[]>([]);
	const [loading, setLoading] = useState(false);
	const [editing, setEditing] = useState<EditingNote>(null);
	const [creating, setCreating] = useState(false);
	const [newTitle, setNewTitle] = useState('');
	const [newContent, setNewContent] = useState('');

	// Fetch notes
	const fetchNotes = useCallback(async () => {
		if (!connected || !currentUserId) return;
		setLoading(true);
		try {
			const result = (await request(SUBJECTS.list(orgId), { userId: currentUserId })) as { notes: Note[] };
			setNotes(result.notes);
		} catch {
			// Silently handle — notes will be empty
		} finally {
			setLoading(false);
		}
	}, [connected, currentUserId, orgId, request]);

	useEffect(() => {
		fetchNotes();
	}, [fetchNotes]);

	// Create note
	const handleCreate = async () => {
		if (!newTitle.trim()) return;
		try {
			await request(SUBJECTS.create(orgId), {
				userId: currentUserId,
				title: newTitle.trim(),
				content: newContent.trim(),
			});
			setNewTitle('');
			setNewContent('');
			setCreating(false);
			fetchNotes();
		} catch {
			// Handle error silently
		}
	};

	// Update note
	const handleUpdate = async () => {
		if (!editing) return;
		try {
			await request(SUBJECTS.update(orgId), {
				userId: currentUserId,
				noteId: editing.id,
				title: editing.title,
				content: editing.content,
			});
			setEditing(null);
			fetchNotes();
		} catch {
			// Handle error silently
		}
	};

	// Delete note
	const handleDelete = async (noteId: string) => {
		try {
			await request(SUBJECTS.delete(orgId), {
				userId: currentUserId,
				noteId,
			});
			fetchNotes();
		} catch {
			// Handle error silently
		}
	};

	const formatDate = (ts: number) => {
		return new Date(ts).toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<div className="flex flex-col h-full p-4 gap-4 overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between shrink-0">
				<div className="flex items-center gap-3">
					<h1 className="text-lg font-semibold text-gray-1000">Notes</h1>
					<span className={`text-xs ${connected ? 'text-green-600' : 'text-red-500'}`}>
						{connected ? 'Connected' : 'Disconnected'}
					</span>
				</div>
				<Button size="small" onClick={() => setCreating(true)} disabled={!connected}>
					New Note
				</Button>
			</div>

			{/* Create form */}
			{creating && (
				<GlassCard variant="raised" padding="md" className="shrink-0">
					<div className="flex flex-col gap-3">
						<Input
							placeholder="Note title"
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
							autoFocus
						/>
						<textarea
							className="w-full min-h-[100px] rounded-md border border-gray-alpha-400 bg-background-100 px-3 py-2 text-copy-13 text-gray-1000 placeholder:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-1 resize-y"
							placeholder="Write your note..."
							value={newContent}
							onChange={(e) => setNewContent(e.target.value)}
						/>
						<div className="flex gap-2 justify-end">
							<Button
								variant="secondary"
								size="small"
								onClick={() => {
									setCreating(false);
									setNewTitle('');
									setNewContent('');
								}}
							>
								Cancel
							</Button>
							<Button size="small" onClick={handleCreate} disabled={!newTitle.trim()}>
								Create
							</Button>
						</div>
					</div>
				</GlassCard>
			)}

			{/* Edit form */}
			{editing && (
				<GlassCard variant="raised" padding="md" glow="var(--khal-accent-primary)" className="shrink-0">
					<div className="flex flex-col gap-3">
						<Input
							placeholder="Note title"
							value={editing.title}
							onChange={(e) => setEditing({ ...editing, title: e.target.value })}
							autoFocus
						/>
						<textarea
							className="w-full min-h-[100px] rounded-md border border-gray-alpha-400 bg-background-100 px-3 py-2 text-copy-13 text-gray-1000 placeholder:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-1 resize-y"
							placeholder="Write your note..."
							value={editing.content}
							onChange={(e) => setEditing({ ...editing, content: e.target.value })}
						/>
						<div className="flex gap-2 justify-end">
							<Button variant="secondary" size="small" onClick={() => setEditing(null)}>
								Cancel
							</Button>
							<Button size="small" onClick={handleUpdate}>
								Save
							</Button>
						</div>
					</div>
				</GlassCard>
			)}

			{/* Notes list */}
			<div className="flex-1 overflow-y-auto flex flex-col gap-3">
				{loading && notes.length === 0 && (
					<p className="text-sm text-gray-700 text-center py-8">Loading notes...</p>
				)}

				{!loading && notes.length === 0 && (
					<div className="flex flex-col items-center justify-center py-12 gap-2">
						<p className="text-sm text-gray-700">No notes yet</p>
						<p className="text-xs text-gray-600">Click "New Note" to create your first note</p>
					</div>
				)}

				{notes.map((note) => (
					<GlassCard key={note.id} hover padding="md">
						<div className="flex flex-col gap-2">
							<div className="flex items-start justify-between gap-2">
								<h3 className="text-sm font-medium text-gray-1000 flex-1">{note.title}</h3>
								<span className="text-xs text-gray-600 shrink-0">{formatDate(note.updatedAt)}</span>
							</div>
							{note.content && (
								<p className="text-xs text-gray-800 line-clamp-3 whitespace-pre-wrap">{note.content}</p>
							)}
							<div className="flex gap-2 justify-end pt-1">
								<Button
									variant="ghost"
									size="small"
									onClick={() =>
										setEditing({ id: note.id, title: note.title, content: note.content })
									}
								>
									Edit
								</Button>
								<Button variant="error" size="small" onClick={() => handleDelete(note.id)}>
									Delete
								</Button>
							</div>
						</div>
					</GlassCard>
				))}
			</div>
		</div>
	);
}
