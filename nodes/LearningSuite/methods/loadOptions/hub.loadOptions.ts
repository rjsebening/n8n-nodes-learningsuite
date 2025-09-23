import type { ILoadOptionsFunctions } from 'n8n-workflow';
import { fetchOptions } from './common';

export async function hub_getHubs(this: ILoadOptionsFunctions) {
	return fetchOptions.call(this, '/hubs', undefined, ['name', 'title'], ['id', 'sid']);
}

export async function hub_getTemplates(this: ILoadOptionsFunctions) {
	return fetchOptions.call(this, '/hub-templates', undefined, ['name', 'title'], ['id', 'sid']);
}
