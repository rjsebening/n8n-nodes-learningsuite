import type { ILoadOptionsFunctions } from 'n8n-workflow';
import { fetchOptions } from './common';
import { fetchFieldDefinition, getLsSimpleType } from '../../shared/customFields.helpers';

export async function customFields_getCards(this: ILoadOptionsFunctions) {
	return fetchOptions.call(this, '/custom-fields/cards', undefined, ['name', 'title'], ['id']);
}

export async function customFields_getDefinitions(this: ILoadOptionsFunctions) {
	const cardId = this.getCurrentNodeParameter('cardId') as string | undefined;
	const customFieldCardId = this.getCurrentNodeParameter('customFieldCardId') as string | undefined;

	const filterCardId = cardId || customFieldCardId;

	return fetchOptions.call(
		this,
		'/custom-fields/definitions',
		filterCardId ? { customFieldCardId: filterCardId } : undefined,
		['label', 'name', 'key'],
		['key'],
	);
}

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

export async function customFields_getFieldType(this: ILoadOptionsFunctions) {
	const fieldKey = this.getCurrentNodeParameter('fieldKey') as string | undefined;

	if (!fieldKey) {
		return [{ name: 'Unknown', value: '' }];
	}

	const definition = await fetchFieldDefinition(this, fieldKey);

	if (!definition) {
		return [{ name: 'Unknown', value: '' }];
	}

	const simpleType = getLsSimpleType(definition);

	return [{ name: simpleType, value: simpleType }];
}

export async function customFields_getFieldOptions(this: ILoadOptionsFunctions) {
	const fieldKey = this.getCurrentNodeParameter('fieldKey') as string | undefined;

	if (!fieldKey) {
		return [];
	}

	const definition = await fetchFieldDefinition(this, fieldKey);

	if (!definition?.typeDefinition?.options) {
		return [];
	}

	const options = definition.typeDefinition.options;

	return options
		.filter((opt) => opt && opt.key)
		.map((opt) => ({
			name: String(opt.label ?? opt.key),
			value: String(opt.key),
		}));
}
