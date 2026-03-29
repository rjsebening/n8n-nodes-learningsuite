import { NodeOperationError, type IDataObject, type IHttpRequestOptions } from 'n8n-workflow';
import { lsRequest } from '../shared';
import type { ExecuteHandler } from '../exec.types';

type QueryParameterEntry = {
	name?: string;
	value?: unknown;
};

type QueryParameterCollection = IDataObject & {
	parameter?: QueryParameterEntry[];
};

function isQueryValue(value: unknown): value is IDataObject[keyof IDataObject] {
	return (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean' ||
		Array.isArray(value) ||
		(typeof value === 'object' && value !== null)
	);
}

const makeRequest: ExecuteHandler = async (ctx, i) => {
	const httpMethod = ctx.getNodeParameter('httpMethod', i) as string;
	const endpoint = ctx.getNodeParameter('endpoint', i) as string;
	const queryParameters = ctx.getNodeParameter('queryParameters', i, {}) as QueryParameterCollection;

	let qs: IDataObject | undefined;
	const arr = queryParameters.parameter;
	if (Array.isArray(arr)) {
		qs = {};
		for (const p of arr) {
			if (p?.name && isQueryValue(p.value)) {
				qs[p.name] = p.value;
			}
		}
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
