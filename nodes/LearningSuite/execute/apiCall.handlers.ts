import type { IHttpRequestOptions } from 'n8n-workflow';
import type { IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { lsRequest } from '../shared';
import type { ExecuteHandler } from '../exec.types';

const makeRequest: ExecuteHandler = async (ctx, i) => {
	const httpMethod = ctx.getNodeParameter('httpMethod', i) as string;
	const endpoint = ctx.getNodeParameter('endpoint', i) as string;
	const queryParameters = ctx.getNodeParameter('queryParameters', i, {}) as IDataObject;

	let qs: IDataObject | undefined;
	const arr = (queryParameters as any)?.parameter as Array<{ name?: string; value?: unknown }> | undefined;
	if (Array.isArray(arr)) {
		qs = {};
		for (const p of arr) if (p?.name) qs[p.name] = p.value as any;
		if (qs && Object.keys(qs).length === 0) qs = undefined;
	}

	let body: IDataObject | undefined;
	if (['POST', 'PUT', 'PATCH'].includes(httpMethod)) {
		const requestBody = ctx.getNodeParameter('requestBody', i, '{}') as string;
		let parsed: unknown;
		try {
			parsed = JSON.parse(requestBody);
		} catch (err) {
			throw new NodeOperationError(ctx.getNode(), `Invalid JSON in request body: ${String(err)}`);
		}
		if (parsed && typeof parsed === 'object') body = parsed as IDataObject;
		else throw new NodeOperationError(ctx.getNode(), 'Request body must be a JSON object');
	}

	return await lsRequest.call(ctx, httpMethod as IHttpRequestOptions['method'], endpoint, { qs, body });
};

export const apiCallHandlers = { makeRequest };
