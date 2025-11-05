// methods/loadOptions/teamMember.loadOptions.ts
import type { ILoadOptionsFunctions } from 'n8n-workflow';
import { lsRequest } from '../../shared';
import { ensureArray } from './common';

function buildLabel(m: any): string {
	const fullName = m?.fullName || [m?.firstName, m?.lastName].filter(Boolean).join(' ') || 'Unbekannt';
	const role = m?.roleId ?? '—';
	const email = m?.email ?? '';
	return [fullName, role, email].filter(Boolean).join(' - ');
}

export async function teamMember_getTeamMembersById(this: ILoadOptionsFunctions) {
	const res = await lsRequest.call(this, 'GET', '/team-members?limit=100');
	const rows = ensureArray(res);
	return rows.map((m: any) => ({
		name: buildLabel(m),
		value: String(m?.id ?? m?.sid ?? m?.slug ?? 'Unknown'),
	}));
}

export async function teamMember_getTeamMembersByEmail(this: ILoadOptionsFunctions) {
	const res = await lsRequest.call(this, 'GET', '/team-members?limit=100');
	const rows = ensureArray(res);
	return rows.map((m: any) => ({
		name: buildLabel(m),
		value: String(m?.email ?? 'Unknown'),
	}));
}
