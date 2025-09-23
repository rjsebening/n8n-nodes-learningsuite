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

// NEU: IPollFunctions in die Union aufnehmen
export function joinUrl(baseUrl: string, path: string): string {
	const base = baseUrl.replace(/\/+$/, '');
	const p = path.startsWith('/') ? path : `/${path}`;
	return `${base}${p}`;
}

/**
 * Stellt sicher, dass ein Endpoint relativ ist (beginnt mit "/") und keine absolute URL enthält.
 */
export function normalizeEndpoint(endpoint: string): string {
	if (!endpoint) throw new ApplicationError('Missing endpoint');
	const e = endpoint.trim();
	if (/^https?:\/\//i.test(e)) {
		throw new ApplicationError('Endpoint must be a relative path (e.g. "/members"). Do not include the base URL.');
	}
	return e.startsWith('/') ? e : `/${e}`;
}

/**
 * Gemeinsame Abwicklung für Requests:
 * - liest Credentials (baseUrl)
 * - erzwingt relative URLs via `normalizeEndpoint`
 * - nutzt bevorzugt `requestWithAuthentication` (setzt Header aus den Credentials)
 * - fallback auf `helpers.request`, falls `requestWithAuthentication` nicht verfügbar ist
 */
async function requestCore(
	this: ApiThis,
	{
		method,
		endpoint,
		qs,
		body,
	}: {
		method: IHttpRequestOptions['method'];
		endpoint: string; // immer relativ
		qs?: IDataObject;
		body?: IDataObject;
	},
): Promise<any> {
	const url = normalizeEndpoint(endpoint);

	// Credentials lesen (liefert baseUrl, apiKey etc. je nach Credential-Def.)
	const creds = (await this.getCredentials('learningSuiteApi')) as IDataObject | null;
	const baseURL = String(creds?.baseUrl || '').trim();
	if (!/^https?:\/\//i.test(baseURL)) {
		throw new NodeOperationError(this.getNode(), `Invalid Base URL in credentials: "${baseURL || '(empty)'}"`);
	}

	// n8n-Request Options
	const options: IDataObject = {
		method,
		baseURL, // wichtig: kombiniert mit relativem `url`
		url,
		json: true,
	};
	if (qs && Object.keys(qs).length) options.qs = qs as JsonObject;
	if (body && Object.keys(body).length) {
		// Nur bei POST/PUT/PATCH sinnvoll – n8n ignoriert body sonst
		if (['POST', 'PUT', 'PATCH'].includes(String(method).toUpperCase())) {
			options.body = body as JsonObject;
		}
	}

	try {
		// Bevorzugt: requestWithAuthentication (setzt Header aus den Credentials)
		const rwAuth = (this as any)?.helpers?.requestWithAuthentication;
		if (typeof rwAuth === 'function') {
			return await rwAuth.call(this, 'learningSuiteApi', options);
		}

		// Fallback: helpers.request mit manuellem Header (falls Credential nicht eingebunden)
		const req = (this as any)?.helpers?.request;
		if (typeof req === 'function') {
			const httpOptions: IHttpRequestOptions = {
				method,
				url: baseURL.replace(/\/+$/, '') + url, // absolute URL bilden
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json',
				},
				qs: options.qs as IHttpRequestOptions['qs'],
				json: true,
			};
			if (options.body) httpOptions.body = options.body as IHttpRequestOptions['body'];

			// Wenn API-Key in Credentials vorhanden ist, typischer Header-Name:
			const apiKey = String(creds?.apiKey || '').trim();
			if (apiKey) {
				httpOptions.headers = {
					...httpOptions.headers,
					'X-API-KEY': apiKey,
				};
			}

			return await req(httpOptions);
		}

		// Weder das eine noch das andere vorhanden:
		throw new ApplicationError('No HTTP helper available on this context.');
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: 'LearningSuite API request failed',
		});
	}
}

/**
 * Vereinheitlichte öffentliche Funktion für relative Pfade (alter Name beibehalten).
 * Beispiel: await lsRequest.call(this, 'GET', '/members', { qs: { limit: 50 } });
 */
export async function lsRequest(
	this: ApiThis,
	method: IHttpRequestOptions['method'],
	endpoint: string,
	{ qs, body }: { qs?: IDataObject; body?: IDataObject } = {},
): Promise<any> {
	return requestCore.call(this, { method, endpoint, qs, body });
}

/**
 * Alias für bestehende Trigger-Implementierungen (war früher absolut). Jetzt identisch:
 * Beispiel: await apiRequest.call(this, { method: 'GET', path: '/webhooks/subscription' });
 */
export async function apiRequest(
	this: ApiThis,
	{
		method,
		path,
		qs,
		body,
	}: {
		method: IHttpRequestOptions['method'];
		path: string; // relativer Pfad erwartet
		qs?: IDataObject;
		body?: IDataObject;
	},
): Promise<any> {
	return requestCore.call(this, { method, endpoint: path, qs, body });
}
