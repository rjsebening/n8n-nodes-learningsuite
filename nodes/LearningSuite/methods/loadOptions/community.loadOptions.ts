import type { ILoadOptionsFunctions, IDataObject, INodePropertyOptions } from 'n8n-workflow';
import { fetchOptions } from './common';
import { lsRequest } from '../../shared';

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
	const qs: IDataObject = {
		limit: 100,
		offset: 0,
	};

	try {
		const badgeGroupId = this.getNodeParameter('badgeGroupId', 0) as string;
		if (badgeGroupId) {
			qs.badgeGroupId = badgeGroupId;
		}
	} catch {}

	const res = await lsRequest.call(this, 'GET', '/community/badges', { qs });
	const rows = Array.isArray(res) ? res : (res?.items ?? res ?? []);
	const options: INodePropertyOptions[] = [];

	for (const r of rows as IDataObject[]) {
		if (!r) continue;
		const id = (r.id ?? r.sid) as string | undefined;
		if (!id) continue;
		const label = (r.name ?? r.title ?? '').toString().trim();
		if (!label) continue;

		options.push({
			name: label,
			value: id,
		});
	}

	return options;
}

export async function community_getLatestPosts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const qs: IDataObject = { order: 'latest', limit: 100, offset: 0 };
	const res = await lsRequest.call(this, 'GET', '/community/posts', { qs });
	const rows = Array.isArray(res) ? res : res ? [res] : [];
	const options: INodePropertyOptions[] = [];

	for (const r of rows) {
		const id = r?.id as string | undefined;
		if (!id) continue;

		const bodyText = (r?.bodyText as string)?.trim();
		const author = (r?.author?.fullName as string)?.trim();
		const name = author ? `${bodyText} - ${author}` : bodyText;

		options.push({ name, value: id });
	}
	return options;
}
