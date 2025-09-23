import { lsRequest } from '../shared';
import type { ExecuteHandler } from '../exec.types';

const getAll: ExecuteHandler = async function (ctx) {
	return await lsRequest.call(ctx, 'GET', '/bundles');
};

const getMembers: ExecuteHandler = async (ctx, i) => {
	const bundleId = ctx.getNodeParameter('bundleId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/bundle/${bundleId}/members`);
};

export const bundleHandlers = { getAll, getMembers };
