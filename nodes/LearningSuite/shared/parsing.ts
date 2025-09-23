export function toIdArray(input: unknown): string[] {
	if (Array.isArray(input)) return input.map((v) => String(v).trim()).filter(Boolean);
	if (typeof input === 'string')
		return input
			.split(',')
			.map((v) => v.trim())
			.filter(Boolean);
	if (input == null) return [];
	return [String(input).trim()].filter(Boolean);
}
