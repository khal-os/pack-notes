'use client';

import { type ComponentType, lazy } from 'react';

interface AppComponentProps {
	windowId: string;
	meta?: Record<string, unknown>;
}

export const components: Record<string, ComponentType<AppComponentProps>> = {
	notes: lazy(() => import('./views/notes/ui/App').then((m) => ({ default: m.NotesApp }))),
};
