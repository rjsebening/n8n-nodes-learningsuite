import type { ILoadOptionsFunctions } from 'n8n-workflow';
import { fetchOptions } from './common';

export async function bundle_getBundles(this: ILoadOptionsFunctions) {
	return fetchOptions.call(this, '/bundles', undefined, ['name', 'title'], ['id', 'sid', 'slug']);
}
