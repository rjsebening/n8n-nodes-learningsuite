import type { IDataObject, ILoadOptionsFunctions } from 'n8n-workflow';
import { lsRequest } from '../../shared';
import { ensureArray } from './common';

type MemberRow = IDataObject & {
	email?: string;
	firstName?: string;
	lastName?: string;
	id?: string | number;
	sid?: string | number;
	slug?: string | number;
};

export async function member_getMembers(this: ILoadOptionsFunctions) {
	const res = await lsRequest.call(this, 'GET', '/members');
	const rows = ensureArray(res) as MemberRow[];
	return rows.map((m) => {
		const label = m?.email
			? `${m.email}${m.firstName || m.lastName ? ` — ${[m.firstName, m.lastName].filter(Boolean).join(' ')}` : ''}`
			: (m?.id ?? 'Unknown');
		return { name: String(label), value: String(m?.id ?? m?.sid ?? m?.slug ?? label) };
	});
}

export async function member_getMembersByEmail(this: ILoadOptionsFunctions) {
	const res = await lsRequest.call(this, 'GET', '/members');
	const rows = ensureArray(res) as MemberRow[];

	return rows
		.filter((m) => !!m.email)
		.map((m) => {
			const label = `${m.email}${m.firstName || m.lastName ? ` — ${[m.firstName, m.lastName].filter(Boolean).join(' ')}` : ''}`;
			return { name: String(label), value: String(m.email) };
		});
}
