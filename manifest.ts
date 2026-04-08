export default {
	id: 'notes',
	views: [
		{
			id: 'notes',
			label: 'Notes',
			permission: 'notes',
			minRole: 'member' as const,
			natsPrefix: 'notes',
			defaultSize: { width: 800, height: 600 },
			component: './views/notes/ui/App',
		},
	],
	desktop: {
		icon: '/icons/dusk/note.svg',
		categories: ['Productivity'],
		comment: 'Create, edit, and manage personal notes',
	},
};
