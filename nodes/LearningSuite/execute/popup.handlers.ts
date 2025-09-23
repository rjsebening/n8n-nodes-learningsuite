import { lsRequest } from '../shared';
import type { ExecuteHandler } from '../exec.types';

const getAll: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 100) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	return await lsRequest.call(ctx, 'GET', '/popups', { qs: { limit, offset } });
};

const get: ExecuteHandler = async (ctx, i) => {
	const popupId = ctx.getNodeParameter('popupId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/popups/${popupId}`);
};

const triggerForMember: ExecuteHandler = async (ctx, i) => {
	const popupId = ctx.getNodeParameter('popupId', i) as string;
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	return await lsRequest.call(ctx, 'POST', `/popups/${popupId}/trigger/${memberId}`);
};

const removeTriggerForMember: ExecuteHandler = async (ctx, i) => {
	const popupId = ctx.getNodeParameter('popupId', i) as string;
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	return await lsRequest.call(ctx, 'DELETE', `/popups/${popupId}/trigger/${memberId}`);
};

export const popupHandlers = { getAll, get, triggerForMember, removeTriggerForMember };
