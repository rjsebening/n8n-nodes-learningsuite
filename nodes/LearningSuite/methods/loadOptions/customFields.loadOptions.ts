import type { ILoadOptionsFunctions } from 'n8n-workflow';
import { fetchOptions } from './common';

/* -------------------------------------------------------------------------- */
/*                            CUSTOM FIELD CARDS                               */
/* -------------------------------------------------------------------------- */

export async function customFields_getCards(this: ILoadOptionsFunctions) {
	return fetchOptions.call(this, '/custom-fields/cards', undefined, ['name', 'title'], ['id']);
}

/* -------------------------------------------------------------------------- */
/*                         CUSTOM FIELD DEFINITIONS                             */
/* -------------------------------------------------------------------------- */

export async function customFields_getDefinitions(this: ILoadOptionsFunctions) {
	const customFieldCardId = this.getCurrentNodeParameter('customFieldCardId') as string | undefined;

	return fetchOptions.call(
		this,
		'/custom-fields/definitions',
		customFieldCardId ? { customFieldCardId } : undefined,
		['label', 'name', 'key'],
		['key'],
	);
}

/* -------------------------------------------------------------------------- */
/*                         CUSTOM FIELD CATEGORIES                              */
/* -------------------------------------------------------------------------- */

export async function customFields_getCategories(this: ILoadOptionsFunctions) {
	const customFieldCardId = this.getCurrentNodeParameter('customFieldCardId') as string | undefined;

	return fetchOptions.call(
		this,
		'/custom-fields/categories',
		customFieldCardId ? { customFieldCardId } : undefined,
		['name', 'title'],
		['id'],
	);
}
