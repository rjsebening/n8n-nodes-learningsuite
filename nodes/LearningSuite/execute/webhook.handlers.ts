import type { IDataObject } from 'n8n-workflow';
import { lsRequest } from '../shared';
import type { ExecuteHandler } from '../exec.types';

const getSubscriptions: ExecuteHandler = async (ctx) => lsRequest.call(ctx, 'GET', '/webhooks/subscription');

const getSubscription: ExecuteHandler = async (ctx, i) => {
	const subscriptionId = ctx.getNodeParameter('subscriptionId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/webhooks/subscription/${subscriptionId}`);
};

const createSubscription: ExecuteHandler = async (ctx, i) => {
	const hookUrl = ctx.getNodeParameter('hookUrl', i) as string;
	const eventType = ctx.getNodeParameter('eventType', i) as string;
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;
	const body: IDataObject = { hookUrl, type: eventType };
	if (additionalOptions.courseInstanceId)
		body.filter = { courseInstanceId: additionalOptions.courseInstanceId as string };
	return await lsRequest.call(ctx, 'POST', '/webhooks/subscription', { body });
};

const updateSubscription: ExecuteHandler = async (ctx, i) => {
	const subscriptionId = ctx.getNodeParameter('subscriptionId', i) as string;
	const hookUrl = ctx.getNodeParameter('hookUrl', i) as string;
	const eventType = ctx.getNodeParameter('eventType', i) as string;
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;
	const body: IDataObject = { hookUrl, type: eventType };
	if (additionalOptions.courseInstanceId)
		body.filter = { courseInstanceId: additionalOptions.courseInstanceId as string };
	return await lsRequest.call(ctx, 'PUT', `/webhooks/subscription/${subscriptionId}`, { body });
};

const deleteSubscription: ExecuteHandler = async (ctx, i) => {
	const subscriptionId = ctx.getNodeParameter('subscriptionId', i) as string;
	return await lsRequest.call(ctx, 'DELETE', `/webhooks/subscription/${subscriptionId}`);
};

const getSampleData: ExecuteHandler = async (ctx, i) => {
	const sampleDataType = ctx.getNodeParameter('sampleDataType', i) as string;
	return await lsRequest.call(ctx, 'GET', `/webhooks/sample-data/${sampleDataType}`);
};

export const webhookHandlers = {
	getSubscriptions,
	getSubscription,
	createSubscription,
	updateSubscription,
	deleteSubscription,
	getSampleData,
};
