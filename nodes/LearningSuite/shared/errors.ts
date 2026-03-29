export function getHttpCode(error: unknown): number | null {
	if (error == null || typeof error !== 'object') return null;

	const e = error as Record<string, unknown>;
	const response =
		typeof e.response === 'object' && e.response !== null ? (e.response as Record<string, unknown>) : undefined;
	const errorDetails =
		typeof e.errorDetails === 'object' && e.errorDetails !== null
			? (e.errorDetails as Record<string, unknown>)
			: undefined;

	const raw =
		e.httpCode ?? e.statusCode ?? e.status ?? response?.statusCode ?? response?.status ?? errorDetails?.httpCode;
	const code = Number(raw);
	return Number.isFinite(code) ? code : null;
}
