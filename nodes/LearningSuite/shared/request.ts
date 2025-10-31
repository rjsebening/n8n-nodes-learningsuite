import {
	ApplicationError,
	NodeApiError,
	NodeOperationError,
	type IDataObject,
	type IHttpRequestOptions,
	type JsonObject,
	type IExecuteFunctions,
	type IHookFunctions,
	type ILoadOptionsFunctions,
	type IWebhookFunctions,
	type ITriggerFunctions,
	type IPollFunctions,
} from 'n8n-workflow';

export type ApiThis =
	| IExecuteFunctions
	| ILoadOptionsFunctions
	| IHookFunctions
	| IWebhookFunctions
	| ITriggerFunctions
	| IPollFunctions;

export function joinUrl(baseUrl: string, path: string): string {
	const base = baseUrl.replace(/\/+$/, '');
	const p = path.startsWith('/') ? path : `/${path}`;
	return `${base}${p}`;
}

export function normalizeEndpoint(endpoint: string): string {
	if (!endpoint) throw new ApplicationError('Missing endpoint');
	const e = endpoint.trim();
	if (/^https?:\/\//i.test(e)) {
		throw new ApplicationError('Endpoint must be a relative path (e.g. "/members"). Do not include the base URL.');
	}
	return e.startsWith('/') ? e : `/${e}`;
}

async function requestCore(
	this: ApiThis,
	{
		method,
		endpoint,
		qs,
		body,
	}: {
		method: IHttpRequestOptions['method'];
		endpoint: string;
		qs?: IDataObject;
		body?: IDataObject;
	},
): Promise<any> {
	const url = normalizeEndpoint(endpoint);

	const creds = (await this.getCredentials('learningSuiteApi')) as IDataObject | null;
	const baseURL = String(creds?.baseUrl || '').trim();
	if (!/^https?:\/\//i.test(baseURL)) {
		throw new NodeOperationError(this.getNode(), `Invalid Base URL in credentials: "${baseURL || '(empty)'}"`);
	}

	const options: IDataObject = {
		method,
		baseURL,
		url,
		json: true,
	};
	if (qs && Object.keys(qs).length) options.qs = qs as JsonObject;
	if (body && Object.keys(body).length) {
		if (['POST', 'PUT', 'PATCH'].includes(String(method).toUpperCase())) {
			options.body = body as JsonObject;
		}
	}

	try {
		const rwAuth = (this as any)?.helpers?.requestWithAuthentication;
		if (typeof rwAuth === 'function') {
			return await rwAuth.call(this, 'learningSuiteApi', options);
		}

		const req = (this as any)?.helpers?.request;
		if (typeof req === 'function') {
			const httpOptions: IHttpRequestOptions = {
				method,
				url: baseURL.replace(/\/+$/, '') + url,
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json',
				},
				qs: options.qs as IHttpRequestOptions['qs'],
				json: true,
			};
			if (options.body) httpOptions.body = options.body as IHttpRequestOptions['body'];

			const apiKey = String(creds?.apiKey || '').trim();
			if (apiKey) {
				httpOptions.headers = {
					...httpOptions.headers,
					'X-API-KEY': apiKey,
				};
			}

			return await req(httpOptions);
		}

		throw new ApplicationError('No HTTP helper available on this context.');
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: 'LearningSuite API request failed',
		});
	}
}

export async function lsRequest(
	this: ApiThis,
	method: IHttpRequestOptions['method'],
	endpoint: string,
	{ qs, body }: { qs?: IDataObject; body?: IDataObject } = {},
): Promise<any> {
	return requestCore.call(this, { method, endpoint, qs, body });
}

export async function apiRequest(
	this: ApiThis,
	{
		method,
		path,
		qs,
		body,
	}: {
		method: IHttpRequestOptions['method'];
		path: string;
		qs?: IDataObject;
		body?: IDataObject;
	},
): Promise<any> {
	return requestCore.call(this, { method, endpoint: path, qs, body });
}
