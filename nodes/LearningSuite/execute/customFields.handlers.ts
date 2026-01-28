import type { IDataObject } from 'n8n-workflow';
import { lsRequest } from '../shared';
import type { ExecuteHandler } from '../exec.types';

/* -------------------------------------------------------------------------- */
/*                                    META                                    */
/* -------------------------------------------------------------------------- */

const getCards: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 15) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;

	return await lsRequest.call(ctx, 'GET', '/custom-fields/cards', {
		qs: { limit, offset },
	});
};

const getCardsExpanded: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 15) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;

	return await lsRequest.call(ctx, 'GET', '/custom-fields/cards/expanded', {
		qs: { limit, offset },
	});
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

/* -------------------------------------------------------------------------- */
/*                                  STORE                                     */
/* -------------------------------------------------------------------------- */

const getStore: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;

	return await lsRequest.call(ctx, 'GET', `/custom-fields/store/${userId}`);
};

const getFieldValues: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const fieldKey = ctx.getNodeParameter('fieldKey', i) as string;

	return await lsRequest.call(ctx, 'GET', `/custom-fields/store/${userId}/fields/${fieldKey}`);
};

const setFieldValue: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const fieldKey = ctx.getNodeParameter('fieldKey', i) as string;

	const profileIndex = ctx.getNodeParameter('setField_profileIndex', i, null);
	const fieldValue = ctx.getNodeParameter('setField_fieldValue', i);

	const body: IDataObject = {
		fieldValue,
	};

	if (profileIndex !== null) {
		body.profileIndex = profileIndex;
	}

	return await lsRequest.call(ctx, 'PUT', `/custom-fields/store/${userId}/fields/${fieldKey}`, { body });
};

const setMultipleFieldValues: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const fields = ctx.getNodeParameter('fields', i, []) as IDataObject[];

	return await lsRequest.call(ctx, 'PUT', `/custom-fields/store/${userId}/fields`, {
		body: fields as unknown as IDataObject,
	});
};

/* -------------------------------------------------------------------------- */
/*                                  PROFILES                                  */
/* -------------------------------------------------------------------------- */

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
	const cardId = ctx.getNodeParameter('cardId', i) as string;

	const profileIndex = ctx.getNodeParameter('profileIndex', i, undefined);
	const profileName = ctx.getNodeParameter('profileName', i, undefined);

	const qs: IDataObject = {};
	if (profileIndex !== undefined) qs.profileIndex = profileIndex;
	if (profileName) qs.profileName = profileName;

	return await lsRequest.call(ctx, 'GET', `/custom-fields/store/${userId}/profiles/by-card/${cardId}`, { qs });
};

const updateProfileField: ExecuteHandler = async (ctx, i) => {
	const userId = ctx.getNodeParameter('userId', i) as string;
	const cardId = ctx.getNodeParameter('cardId', i) as string;

	const body = ctx.getNodeParameter('profileFieldPayload', i) as IDataObject;

	return await lsRequest.call(ctx, 'PUT', `/custom-fields/store/${userId}/profiles/by-card/${cardId}`, { body });
};

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const customFieldsHandlers = {
	// cards & meta
	getCards,
	getCardsExpanded,
	getDefinitions,
	getCategories,

	// store
	getStore,
	getFieldValues,
	setFieldValue,
	setMultipleFieldValues,

	// profiles
	getProfiles,
	getProfilesExpanded,
	getProfileByCard,
	updateProfileField,
};
