export const SUBJECTS = {
	list: (orgId: string) => `khal.${orgId}.notes.list`,
	create: (orgId: string) => `khal.${orgId}.notes.create`,
	update: (orgId: string) => `khal.${orgId}.notes.update`,
	delete: (orgId: string) => `khal.${orgId}.notes.delete`,
} as const;
