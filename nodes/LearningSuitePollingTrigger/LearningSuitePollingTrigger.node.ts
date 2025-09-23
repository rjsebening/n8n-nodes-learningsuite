import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	type IPollFunctions,
	type INodeExecutionData,
	type IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

import { apiRequest } from '../LearningSuite/shared/request';
import { properties as pollingProperties } from './descriptions/trigger.polling.properties';
import * as loCommunity from '../LearningSuite/methods/loadOptions/community.loadOptions';

const POLLING_EVENTS = new Set<string>([
	'bundle.created',
	'customPopup.created',
	'group.created',
	'community.area.created',
	'community.badge.created',
	'community.forum.created',
	'member.created',
	'member.inactiveForXDays',
]);

async function fetchInactiveMembers(
	self: IPollFunctions,
	{
		days,
		includeNever,
		limit = 100,
		maxPages = 50,
	}: { days: number; includeNever: boolean; limit?: number; maxPages?: number },
): Promise<IDataObject[]> {
	let offset = 0;
	const out: IDataObject[] = [];

	for (let page = 0; page < maxPages; page++) {
		const qs: IDataObject = {
			limit,
			offset,
			days_not_logged_in_gte: days,
			include_never_logged_in: includeNever,
		};

		const res = await apiRequest.call(self as any, {
			method: 'GET',
			path: '/members',
			qs,
		});

		const items: any[] = Array.isArray(res)
			? res
			: Array.isArray(res?.items)
				? res.items
				: Array.isArray(res?.data)
					? res.data
					: [];

		if (!items.length) break;

		out.push(...(items as IDataObject[]));
		if (items.length < limit) break;
		offset += limit;
	}

	return out;
}

async function pollFetchCreatedSince(
	self: IPollFunctions,
	path: string,
	sinceIso: string,
	{
		limit = 50,
		createdKey = 'createdAt',
		updatedKey = 'updatedAt',
		extract = (r: any) => (Array.isArray(r) ? r : Array.isArray(r?.items) ? r.items : r),
	}: {
		limit?: number;
		createdKey?: string;
		updatedKey?: string;
		extract?: (r: any) => any[];
	} = {},
): Promise<IDataObject[]> {
	let offset = 0;
	const out: IDataObject[] = [];
	const since = new Date(sinceIso).toISOString();

	for (let page = 0; page < 20; page++) {
		const qs: IDataObject = { limit, offset };
		const res = await apiRequest.call(self as any, { method: 'GET', path, qs });
		const rows = extract(res) as any[];
		if (!rows?.length) break;

		for (const row of rows) {
			const ts = row?.[createdKey] ?? row?.[updatedKey];
			if (!ts) {
				out.push(row as IDataObject);
				continue;
			}
			if (new Date(ts).toISOString() > since) out.push(row as IDataObject);
		}
		if (rows.length < limit) break;
		offset += limit;
	}

	return out;
}

export class LearningSuitePollingTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LearningSuite Polling Trigger',
		name: 'learningSuitePollingTrigger',
		icon: 'file:icon.svg',
		/*icon: 'fa:graduation-cap',*/
		group: ['trigger', 'schedule'],
		version: 1,
		polling: true,
		description: 'Polling Trigger node for LearningSuite API (powered by agentur-systeme.de)',
		subtitle: '={{$parameter["event"]}}',
		defaults: {
			name: 'LearningSuite Polling Trigger',
			// @ts-expect-error -- some linters require this
			description: 'Polling Trigger node for LearningSuite API (powered by agentur-systeme.de)',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [{ name: 'learningSuiteApi', required: true }],
		properties: pollingProperties,
	};

	methods = {
		loadOptions: {
			community_getAreas: loCommunity.community_getAreas,
		},
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const event = this.getNodeParameter('event', 0) as string;
		if (!POLLING_EVENTS.has(event)) return null;

		const store = this.getWorkflowStaticData('node') as IDataObject;
		const cursorMap = (store.lastTimeCheckedMap as IDataObject) || {};
		const nowIso = new Date().toISOString();
		const lastIso = (cursorMap[event] as string) || new Date(0).toISOString();

		let items: IDataObject[] = [];

		switch (event) {
			case 'bundle.created':
				items = await pollFetchCreatedSince(this, '/bundles', lastIso);
				break;
			case 'customPopup.created':
				items = await pollFetchCreatedSince(this, '/popups', lastIso);
				break;
			case 'group.created':
				items = await pollFetchCreatedSince(this, '/groups', lastIso);
				break;
			case 'community.area.created':
				items = await pollFetchCreatedSince(this, '/community/areas', lastIso);
				break;
			case 'community.badge.created':
				items = await pollFetchCreatedSince(this, '/community/badges', lastIso);
				break;
			case 'community.forum.created': {
				const areaId = (this.getNodeParameter('additionalOptionsForum.areaId', '') as string).trim();
				// Optionaler Filter clientseitig – falls API keinen QS-Filter hat
				const all = await pollFetchCreatedSince(this, '/community/forums', lastIso);
				items = areaId ? (all as any[]).filter((f) => String(f?.areaId ?? '') === areaId) : all;
				break;
			}
			case 'member.created':
				items = await pollFetchCreatedSince(this, '/members', lastIso);
				break;
			case 'member.inactiveForXDays': {
				const days = Number(this.getNodeParameter('inactiveDays', 0));
				const includeNever = Boolean(this.getNodeParameter('includeNeverLoggedIn', false));

				if (!Number.isFinite(days) || days < 1) {
					throw new NodeOperationError(this.getNode(), 'Please provide a valid number of days (> 0).');
				}

				const all = await fetchInactiveMembers(this, { days, includeNever });
				const store = this.getWorkflowStaticData('node') as IDataObject;
				const dedupeKey = `inactive_emitted_${days}_${includeNever ? '1' : '0'}`;
				const alreadyEmitted = new Set<string>((store[dedupeKey] as string[]) || []);

				const fresh: IDataObject[] = [];
				for (const row of all) {
					const id = String((row as any)?.id ?? '');
					if (!id) continue;

					if (this.getMode() === 'manual') {
						fresh.push(row);
					} else if (!alreadyEmitted.has(id)) {
						alreadyEmitted.add(id);
						fresh.push(row);
					}
				}
				store[dedupeKey] = Array.from(alreadyEmitted).slice(-5000);

				items = fresh;
				break;
			}

			default:
				items = [];
		}

		cursorMap[event] = nowIso;
		store.lastTimeCheckedMap = cursorMap;

		if (!items.length) return null;
		// @ts-ignore helpers runtime
		return [this.helpers.returnJsonArray(items)];
	}
}
