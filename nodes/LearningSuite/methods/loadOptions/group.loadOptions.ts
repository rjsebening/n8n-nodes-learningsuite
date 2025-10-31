import type { ILoadOptionsFunctions } from 'n8n-workflow';
import { fetchOptions } from './common';

export async function group_getGroups(this: ILoadOptionsFunctions) {
	return fetchOptions.call(this, '/groups', undefined, ['name', 'title'], ['id', 'sid']);
}
