export function getHttpCode(error: unknown): number | null {
	if (error == null || typeof error !== 'object') return null;
	const e = error as Record<string, any>;
	const raw =
		e.httpCode ?? e.statusCode ?? e.status ?? e.response?.statusCode ?? e.response?.status ?? e.errorDetails?.httpCode;
	const code = Number(raw);
	return Number.isFinite(code) ? code : null;
}
