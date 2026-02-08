// n8n-nodes-learningsuite/nodes/LearningSuite/methods/resourceMappers/customFields.multiple.resourceMapper.ts
import type { ILoadOptionsFunctions, ResourceMapperFields, ResourceMapperField } from 'n8n-workflow';
import { lsRequest } from '../../shared';
import { mapLsType, collectAllFieldDefinitions } from '../../shared/customFields.shared';

export async function getMultipleCustomFieldValueResourceMapperFields(
	this: ILoadOptionsFunctions,
): Promise<ResourceMapperFields> {
	try {
		const cards = await lsRequest.call(this, 'GET', '/custom-fields/cards/expanded');

		if (!Array.isArray(cards)) {
			return { fields: [] };
		}

		const definitions = collectAllFieldDefinitions(cards);

		if (definitions.length === 0) {
			return { fields: [] };
		}

		const fields: ResourceMapperField[] = definitions.map((def) => {
			const mapped = mapLsType(def);

			const displayName = mapped.maxInfo ? `${def.name} (${mapped.maxInfo})` : def.name;

			return {
				id: def.key,
				displayName: displayName || def.key,
				type: mapped.type,
				options: mapped.options,
				required: false,
				canBeUsedToMatch: false,
				defaultMatch: false,
				display: true,
			};
		});

		return { fields };
	} catch (error) {
		return { fields: [] };
	}
}
