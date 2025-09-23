import type { ILoadOptionsFunctions } from 'n8n-workflow';
import { fetchOptions } from './common';

export async function webhook_getSubscriptions(this: ILoadOptionsFunctions) {
	return fetchOptions.call(this, '/webhooks/subscription', undefined, ['hookUrl', 'name'], ['id', 'sid']);
}
