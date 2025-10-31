import type { ILoadOptionsFunctions } from 'n8n-workflow';
import { lsRequest } from '../../shared';
import { ensureArray } from './common';

export async function member_getMembers(this: ILoadOptionsFunctions) {
	const res = await lsRequest.call(this, 'GET', '/members');
	const rows = ensureArray(res);
	return rows.map((m: any) => {
		const label = m?.email
			? `${m.email}${m.firstName || m.lastName ? ` — ${[m.firstName, m.lastName].filter(Boolean).join(' ')}` : ''}`
			: (m?.id ?? 'Unknown');
		return { name: String(label), value: String(m?.id ?? m?.sid ?? m?.slug ?? label) };
	});
}

export async function member_getMembersByEmail(this: ILoadOptionsFunctions) {
	const res = await lsRequest.call(this, 'GET', '/members');
	const rows = ensureArray(res);

	return rows
		.filter((m: any) => !!m?.email)
		.map((m: any) => {
			const label = `${m.email}${m.firstName || m.lastName ? ` — ${[m.firstName, m.lastName].filter(Boolean).join(' ')}` : ''}`;
			return { name: String(label), value: String(m.email) };
		});
}
