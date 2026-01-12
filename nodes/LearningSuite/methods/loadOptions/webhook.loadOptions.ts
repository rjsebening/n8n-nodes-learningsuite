import type { ILoadOptionsFunctions } from 'n8n-workflow';
import { lsRequest } from '../../shared';
import { ensureArray } from './common';

export async function webhook_getSubscriptions(this: ILoadOptionsFunctions) {
	const res = await lsRequest.call(this, 'GET', '/webhooks/subscription');
	const rows = ensureArray(res);

	return rows.map((s: any) => {
		const label = s?.type ?? 'Unknown type';

		return {
			name: String(label),
			description: String(s?.url),
			value: String(s?.id),
		};
	});
}
