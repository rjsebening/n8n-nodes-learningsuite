import type { ILoadOptionsFunctions, IDataObject, INodePropertyOptions } from 'n8n-workflow';
import { fetchOptions } from './common';

export async function community_getAreas(this: ILoadOptionsFunctions) {
	return fetchOptions.call(this, '/community/areas', undefined, ['name', 'title'], ['id', 'sid']);
}

export async function community_getForums(this: ILoadOptionsFunctions) {
	let qs: IDataObject | undefined = undefined;
	try {
		const areaId = this.getNodeParameter('areaId', 0) as string;
		if (areaId) qs = { areaId };
	} catch {}
	return fetchOptions.call(this, '/community/forums', qs, ['name', 'title'], ['id', 'sid']);
}

export async function community_getBadges(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const qs: IDataObject = { limit: 200, offset: 0 };
	try {
		const badgeGroupId = this.getNodeParameter('badgeGroupId', 0) as string;
		if (badgeGroupId) qs.badgeGroupId = badgeGroupId;
	} catch {}
	return fetchOptions.call(this, '/community/badges', qs, ['name', 'title'], ['id', 'sid']);
}
