import type { ILoadOptionsFunctions } from 'n8n-workflow';

export function getScopedParam(this: ILoadOptionsFunctions, paramName: string): string | undefined {
	try {
		const local = this.getCurrentNodeParameter(paramName) as unknown;
		if (typeof local === 'string' && local) return local;
	} catch {}

	try {
		const rootVal = this.getNodeParameter(paramName, 0, undefined) as unknown;
		if (typeof rootVal === 'string' && rootVal) return rootVal;
	} catch {}

	try {
		const params = (this.getNode().parameters ?? {}) as Record<string, unknown>;

		for (const val of Object.values(params)) {
			if (val && typeof val === 'object') {
				const obj = val as Record<string, unknown>;
				if (Object.prototype.hasOwnProperty.call(obj, paramName)) {
					const v = obj[paramName];
					if (typeof v === 'string' && v) return v;
				}
			}
		}
	} catch {}

	return undefined;
}
