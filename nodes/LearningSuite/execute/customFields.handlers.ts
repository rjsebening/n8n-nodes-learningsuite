import type { IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { lsRequest } from '../shared';
import type { ExecuteHandler } from '../exec.types';

type LsType = 'string' | 'number' | 'boolean' | 'date' | 'time' | 'dateTime' | 'select' | 'files' | 'images' | 'videos';

function normalizeSingleFieldValueOrFail(ctx: any, input: unknown, fieldKey: string, lsType: LsType) {
	if (input === undefined || input === null) {
		throw new NodeOperationError(ctx.getNode(), `No value provided for custom field "${fieldKey}".`);
	}

	let value: unknown = input;

	if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
		const record = value as Record<string, unknown>;
		const values = Object.values(record);
		if (values.length === 1) {
			value = values[0];
		}
	}

	if (lsType === 'select') {
		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (trimmed.startsWith('[')) {
				try {
					const parsed = JSON.parse(trimmed);
					if (Array.isArray(parsed)) {
						return parsed;
					}
				} catch {}
			}
		}
		return Array.isArray(value) ? value : [value];
	}

	if (['files', 'images', 'videos'].includes(lsType)) {
		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
				try {
					value = JSON.parse(trimmed);
				} catch {
				}
			}
		}

		if (Array.isArray(value)) {
			return value.map((item) => {
				if (typeof item === 'object' && item !== null && 'data' in item) {
					const bin = item as Record<string, unknown>;
					const fileData: Record<string, unknown> = { data: bin.data };
					if ('fileName' in bin && bin.fileName) fileData.name = bin.fileName;
					if ('mimeType' in bin && bin.mimeType) fileData.mimeType = bin.mimeType;
					if ('fileSize' in bin && typeof bin.fileSize === 'number') fileData.fileSize = bin.fileSize;
					return fileData;
				}
				return item;
			});
		}

		if (typeof value === 'object' && value !== null && 'data' in value) {
			const bin = value as Record<string, unknown>;
			const fileData: Record<string, unknown> = { data: bin.data };
			if ('fileName' in bin && bin.fileName) fileData.name = bin.fileName;
			if ('mimeType' in bin && bin.mimeType) fileData.mimeType = bin.mimeType;
			if ('fileSize' in bin && typeof bin.fileSize === 'number') fileData.fileSize = bin.fileSize;
			return [fileData];
		}

		return Array.isArray(value) ? value : [value];
	}

	if (lsType === 'date' || lsType === 'dateTime' || lsType === 'time') {
		if (typeof value === 'string') {
			return value;
		}
		throw new NodeOperationError(
			ctx.getNode(),
			`Invalid value for date/time custom field "${fieldKey}". Expected a string, got ${typeof value}.`,
		);
	}

	if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
		return value;
	}

	throw new NodeOperationError(ctx.getNode(), `Invalid value for custom field "${fieldKey}" (${lsType}).`);
}

function normalizeCustomFieldValue(response: unknown): IDataObject {
	if (!Array.isArray(response)) {
		return { value: response ?? null };
	}
	if (response.length === 0) return { value: null };
	if (response.length === 1) return { value: response[0] };
	return { value: response };
}

function getProfileIndex(ctx: any, i: number, paramName = 'profileIndex'): number {
	const value = ctx.getNodeParameter(paramName, i, 0);
	return typeof value === 'number' ? value : 0;
}

function readTypedFieldValue(ctx: any, i: number, fieldType: string): unknown {
	switch (fieldType) {
		case 'string':
			return ctx.getNodeParameter('fieldValueString', i) as string;
		case 'number':
			return ctx.getNodeParameter('fieldValueNumber', i) as number;
		case 'boolean':
			return ctx.getNodeParameter('fieldValueBoolean', i) as boolean;
		case 'dateTime':
			return ctx.getNodeParameter('fieldValueDateTime', i) as string;
		case 'option': {
			const singleOption = ctx.getNodeParameter('fieldValueOption', i) as string;
			return [singleOption];
		}
		case 'multiOptions':
			return ctx.getNodeParameter('fieldValueMultiOptions', i) as string[];
		case 'files': {
			const parsed = ctx.getNodeParameter('fieldValueFiles', i, []);
			return Array.isArray(parsed) ? parsed : [parsed];
		}
		case 'images': {
			const parsed = ctx.getNodeParameter('fieldValueImages', i, []);
			return Array.isArray(parsed) ? parsed : [parsed];
		}
		case 'videos': {
			const parsed = ctx.getNodeParameter('fieldValueVideos', i, []);
			return Array.isArray(parsed) ? parsed : [parsed];
		}
		default:
			return ctx.getNodeParameter('fieldValueFallback', i, '') as string;
	}
}

const getCards: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 15) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	return await lsRequest.call(ctx, 'GET', '/custom-fields/cards', { qs: { limit, offset } });
};

const getCardsExpanded: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 15) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	return await lsRequest.call(ctx, 'GET', '/custom-fields/cards/expanded', { qs: { limit, offset } });
};

const getDefinitions: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 15) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	const customFieldCardId = ctx.getNodeParameter('customFieldCardId', i, undefined);

	const qs: IDataObject = { limit, offset };
	if (customFieldCardId) qs.customFieldCardId = customFieldCardId;

	return await lsRequest.call(ctx, 'GET', '/custom-fields/definitions', { qs });
};

const getCategories: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 15) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	const customFieldCardId = ctx.getNodeParameter('customFieldCardId', i, undefined);

	const qs: IDataObject = { limit, offset };
	if (customFieldCardId) qs.customFieldCardId = customFieldCardId;

	return await lsRequest.call(ctx, 'GET', '/custom-fields/categories', { qs });
};

const getStore: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/custom-fields/store/${userId}`);
};

const getFieldValues: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const fieldKey = ctx.getNodeParameter('fieldKey', i) as string;
	const response = await lsRequest.call(ctx, 'GET', `/custom-fields/store/${userId}/fields/${fieldKey}`);
	return normalizeCustomFieldValue(response);
};

const setFieldValue: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const fieldKey = ctx.getNodeParameter('fieldKey', i) as string;
	const fieldType = ctx.getNodeParameter('fieldType', i, '') as string;

	const fieldValue = readTypedFieldValue(ctx, i, fieldType);

	if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
		throw new NodeOperationError(ctx.getNode(), `No value provided for custom field "${fieldKey}".`);
	}

	const profileIndex = ctx.getNodeParameter('profileIndex', i, null) as number | null;
	const validProfileIndex = profileIndex !== null && Number.isFinite(profileIndex) ? profileIndex : undefined;

	const body: IDataObject = { fieldValue };
	if (validProfileIndex !== undefined) {
		body.profileIndex = validProfileIndex;
	}

	const response = await lsRequest.call(ctx, 'PUT', `/custom-fields/store/${userId}/fields/${fieldKey}`, { body });
	return normalizeCustomFieldValue(response);
};

function buildFieldTypeMap(
	cards: Array<{
		definitions?: Array<{
			key?: string;
			typeDefinition?: { type?: string };
		}>;
	}>,
): Map<string, LsType> {
	const typeMap = new Map<string, LsType>();

	for (const card of cards) {
		if (!Array.isArray(card?.definitions)) continue;
		for (const def of card.definitions) {
			if (def?.key && def?.typeDefinition?.type) {
				typeMap.set(def.key, def.typeDefinition.type as LsType);
			}
		}
	}

	return typeMap;
}

const setMultipleFieldValues: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const profileIndex = getProfileIndex(ctx, i, 'profileIndex');

	const mapperData = ctx.getNodeParameter('fieldValues', i) as { value?: Record<string, unknown> };
	const fieldMappings = mapperData?.value || {};

	const cardsResponse = await lsRequest.call(ctx, 'GET', '/custom-fields/cards/expanded');

	if (!Array.isArray(cardsResponse)) {
		throw new NodeOperationError(ctx.getNode(), 'Failed to load custom field definitions.');
	}

	const cards = cardsResponse as Array<{
		definitions?: Array<{
			key?: string;
			typeDefinition?: { type?: string };
		}>;
	}>;

	const fieldTypeMap = buildFieldTypeMap(cards);

	const payload = Object.entries(fieldMappings)
		.filter(([, value]) => value !== undefined)
		.map(([fieldKey, value]) => {
			const lsType = fieldTypeMap.get(fieldKey);

			if (!lsType) {
				throw new NodeOperationError(ctx.getNode(), `Unknown custom field "${fieldKey}".`);
			}

			return {
				fieldKey,
				profileIndex,
				fieldValue: normalizeSingleFieldValueOrFail(ctx, value, fieldKey, lsType),
			};
		});

	if (!payload.length) {
		return [];
	}

	return await lsRequest.call(ctx, 'PUT', `/custom-fields/store/${userId}/fields`, {
		body: payload as unknown as IDataObject,
	});
};

const getProfiles: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const customFieldCardId = ctx.getNodeParameter('customFieldCardId', i, undefined);

	const qs: IDataObject = {};
	if (customFieldCardId) qs.customFieldCardId = customFieldCardId;

	return await lsRequest.call(ctx, 'GET', `/custom-fields/store/${userId}/profiles`, { qs });
};

const getProfilesExpanded: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const customFieldCardId = ctx.getNodeParameter('customFieldCardId', i, undefined);

	const qs: IDataObject = {};
	if (customFieldCardId) qs.customFieldCardId = customFieldCardId;

	return await lsRequest.call(ctx, 'GET', `/custom-fields/store/${userId}/profiles/expanded`, { qs });
};

const getProfileByCard: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const cardId = ctx.getNodeParameter('customFieldCardId', i) as string;

	const profileIndex = ctx.getNodeParameter('profileIndex', i, null) as number | null;
	const profileName = ctx.getNodeParameter('profileName', i, '');

	const qs: IDataObject = {};
	if (profileIndex !== null && Number.isFinite(profileIndex)) {
		qs.profileIndex = profileIndex;
	} else if (profileName) {
		qs.profileName = profileName;
	}

	return await lsRequest.call(ctx, 'GET', `/custom-fields/store/${userId}/profiles/by-card/${cardId}`, { qs });
};

const updateProfileField: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const cardId = ctx.getNodeParameter('customFieldCardId', i) as string;
	const fieldKey = ctx.getNodeParameter('fieldKey', i) as string;
	const fieldType = ctx.getNodeParameter('fieldType', i, '') as string;

	const fieldValue = readTypedFieldValue(ctx, i, fieldType);

	if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
		throw new NodeOperationError(ctx.getNode(), `No value provided for custom field "${fieldKey}".`);
	}

	const body: IDataObject = { fieldKey, fieldValue };

	const profileIndex = ctx.getNodeParameter('profileIndex', i, null) as number | null;
	if (profileIndex !== null && Number.isFinite(profileIndex)) {
		body.profileIndex = profileIndex;
	}

	if (body.profileIndex === undefined) {
		const profileName = ctx.getNodeParameter('profileName', i, '');
		if (profileName) {
			body.profileName = profileName;
		}
	}

	const response = await lsRequest.call(ctx, 'PUT', `/custom-fields/store/${userId}/profiles/by-card/${cardId}`, {
		body,
	});
	return normalizeCustomFieldValue(response);
};

export const customFieldsHandlers = {
	getCards,
	getCardsExpanded,
	getDefinitions,
	getCategories,
	getStore,
	getFieldValues,
	setFieldValue,
	setMultipleFieldValues,
	getProfiles,
	getProfilesExpanded,
	getProfileByCard,
	updateProfileField,
};
