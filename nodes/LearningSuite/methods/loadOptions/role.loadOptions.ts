import type { ILoadOptionsFunctions } from 'n8n-workflow';
import { fetchOptions } from './common';

export async function role_getRoles(this: ILoadOptionsFunctions) {
	return fetchOptions.call(this, '/user/roles', undefined, ['name'], ['id']);
}
