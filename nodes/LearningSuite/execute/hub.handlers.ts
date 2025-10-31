import type { IDataObject } from 'n8n-workflow';
import { lsRequest, toIdArray } from '../shared';
import type { ExecuteHandler } from '../exec.types';

const getAll: ExecuteHandler = async (ctx) => lsRequest.call(ctx, 'GET', '/hubs');
const getTemplates: ExecuteHandler = async (ctx) => lsRequest.call(ctx, 'GET', '/hub-templates');

const create: ExecuteHandler = async (ctx, i) => {
	const templateId = ctx.getNodeParameter('templateId', i) as string;
	const name = ctx.getNodeParameter('name', i) as string;
	const add = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;
	const body: IDataObject = { templateId, name, ...add };
	if (body.sortIndex !== undefined) body.sortIndex = Number(body.sortIndex);
	if (typeof body.templateVariables === 'string') {
		body.templateVariables = JSON.parse(body.templateVariables as string);
	}
	return lsRequest.call(ctx, 'POST', '/hub', { body });
};

const addAccess: ExecuteHandler = async (ctx, i) => {
	const hubId = ctx.getNodeParameter('hubId', i) as string;
	const body: IDataObject = {};
	const memberIds = toIdArray(ctx.getNodeParameter('memberIds', i));
	const groupIds = toIdArray(ctx.getNodeParameter('groupIds', i));
	const bundleIds = toIdArray(ctx.getNodeParameter('bundleIds', i));
	if (memberIds.length) body.memberIds = memberIds;
	if (groupIds.length) body.groupIds = groupIds;
	if (bundleIds.length) body.bundleIds = bundleIds;
	return await lsRequest.call(ctx, 'PUT', `/hub/${hubId}/access`, { body });
};

const removeAccess: ExecuteHandler = async (ctx, i) => {
	const hubId = ctx.getNodeParameter('hubId', i) as string;
	const body: IDataObject = {};
	const memberIds = toIdArray(ctx.getNodeParameter('memberIds', i));
	const groupIds = toIdArray(ctx.getNodeParameter('groupIds', i));
	const bundleIds = toIdArray(ctx.getNodeParameter('bundleIds', i));
	if (memberIds.length) body.memberIds = memberIds;
	if (groupIds.length) body.groupIds = groupIds;
	if (bundleIds.length) body.bundleIds = bundleIds;
	return await lsRequest.call(ctx, 'DELETE', `/hub/${hubId}/access`, { body });
};

const getTemplateVariables: ExecuteHandler = async (ctx, i) => {
	const templateId = ctx.getNodeParameter('templateId', i) as string;

	const raw = await lsRequest.call(ctx, 'GET', `/hub-template/${templateId}/variables`);
	const arr = Array.isArray(raw) ? raw : [raw];
	return arr.map((v) => ({ variable: String(v) })) as IDataObject[];
};

export const hubHandlers = {
	getAll,
	getTemplates,
	create,
	addAccess,
	removeAccess,
	getTemplateVariables,
};
