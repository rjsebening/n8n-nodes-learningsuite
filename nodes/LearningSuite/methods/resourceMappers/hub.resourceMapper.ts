import type { ILoadOptionsFunctions, ResourceMapperFields, ResourceMapperField } from 'n8n-workflow';
import { lsRequest } from '../../shared';

const templateVariablesCache = new Map<string, ResourceMapperFields>();

export async function getTemplateVariablesResourceMapperFields(
	this: ILoadOptionsFunctions,
): Promise<ResourceMapperFields> {
	let templateId = this.getCurrentNodeParameter('templateId') as string;

	if (templateId === undefined || templateId === null) {
		return { fields: [] };
	}
	if (templateId === '' || templateId === 'undefined' || templateId === 'null') {
		return { fields: [] };
	}

	const cached = templateVariablesCache.get(templateId);
	if (cached) {
		return cached;
	}

	const raw = await lsRequest.call(this, 'GET', `/hub-template/${templateId}/variables`);

	const variables: string[] = Array.isArray(raw) ? raw : [];
	const fields: ResourceMapperField[] = variables.map((variable) => ({
		id: variable,
		displayName: variable,
		defaultMatch: false,
		canBeUsedToMatch: false,
		required: true,
		display: true,
		type: 'string',
	}));

	const mapped: ResourceMapperFields = { fields };

	templateVariablesCache.set(templateId, mapped);

	return mapped;
}
