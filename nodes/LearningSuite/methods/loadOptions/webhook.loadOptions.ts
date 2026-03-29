import type { IDataObject, ILoadOptionsFunctions } from 'n8n-workflow';
import { lsRequest } from '../../shared';
import { ensureArray } from './common';

type SubscriptionRow = IDataObject & {
	type?: string;
	url?: string;
	id?: string | number;
};

export async function webhook_getSubscriptions(this: ILoadOptionsFunctions) {
	const res = await lsRequest.call(this, 'GET', '/webhooks/subscription');
	const rows = ensureArray(res) as SubscriptionRow[];

	return rows.map((s) => {
		const label = s?.type ?? 'Unknown type';

		return {
			name: String(label),
			description: String(s?.url),
			value: String(s?.id),
		};
	});
}
