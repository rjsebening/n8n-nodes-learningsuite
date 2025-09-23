import type { ILoadOptionsFunctions } from 'n8n-workflow';
import { fetchOptions } from './common';

export async function popup_getPopups(this: ILoadOptionsFunctions) {
	return fetchOptions.call(this, '/popups', undefined, ['name', 'title'], ['id', 'sid']);
}
