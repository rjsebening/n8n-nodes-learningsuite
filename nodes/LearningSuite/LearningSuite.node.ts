import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import type { HandlersRegistry } from './exec.types';

// methods - loadOptions
import { methods as credentialMethods } from './methods/credentialTest';
import * as loBundle from './methods/loadOptions/bundle.loadOptions';
import * as loCommunity from './methods/loadOptions/community.loadOptions';
import * as loCourse from './methods/loadOptions/course.loadOptions';
import * as loGroup from './methods/loadOptions/group.loadOptions';
import * as loHub from './methods/loadOptions/hub.loadOptions';
import * as loMember from './methods/loadOptions/member.loadOptions';
import * as loModule from './methods/loadOptions/module.loadOptions';
import * as loPopup from './methods/loadOptions/popup.loadOptions';
import * as loRole from './methods/loadOptions/role.loadOptions';
import * as loWebhook from './methods/loadOptions/webhook.loadOptions';
import * as loTeamMember from './methods/loadOptions/teamMember.loadOptions';

import { getTemplateVariablesResourceMapperFields } from './methods/resourceMappers/hub.resourceMapper';

// properties
import { resourceSelector } from './descriptions/resource.selector';
import { apiCallProperties } from './descriptions/apiCall.properties';
import { bundleProperties } from './descriptions/bundle.properties';
import { communityProperties } from './descriptions/community.properties';
import { courseProperties } from './descriptions/course.properties';
import { groupProperties } from './descriptions/group.properties';
import { hubProperties } from './descriptions/hub.properties';
import { memberProperties } from './descriptions/member.properties';
import { moduleProperties } from './descriptions/module.properties';
import { popupProperties } from './descriptions/popup.properties';
import { roleProperties } from './descriptions/role.properties';
import { teamMemberProperties } from './descriptions/teamMember.properties';
import { webhookProperties } from './descriptions/webhook.properties';

// handlers
import { apiCallHandlers } from './execute/apiCall.handlers';
import { bundleHandlers } from './execute/bundle.handlers';
import { communityHandlers } from './execute/community.handlers';
import { courseHandlers } from './execute/course.handlers';
import { groupHandlers } from './execute/group.handlers';
import { hubHandlers } from './execute/hub.handlers';
import { memberHandlers } from './execute/member.handlers';
import { moduleHandlers } from './execute/module.handlers';
import { popupHandlers } from './execute/popup.handlers';
import { roleHandlers } from './execute/role.handlers';
import { teamMemberHandlers } from './execute/teamMember.handlers';
import { webhookHandlers } from './execute/webhook.handlers';

const registry: HandlersRegistry = {
	apiCall: { ...apiCallHandlers },
	bundle: { ...bundleHandlers },
	community: { ...communityHandlers },
	course: { ...courseHandlers },
	group: { ...groupHandlers },
	hub: { ...hubHandlers },
	member: { ...memberHandlers },
	module: { ...moduleHandlers },
	popup: { ...popupHandlers },
	role: { ...roleHandlers },
	teamMember: { ...teamMemberHandlers },
	webhook: { ...webhookHandlers },
};

export class LearningSuite implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LearningSuite',
		name: 'learningSuite',
		icon: {
			light: 'file:./icons/icon-light.svg',
			dark: 'file:./icons/icon-dark.svg',
		},
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with LearningSuite API (powered by agentur-systeme.de)',
		defaults: {
			name: 'LearningSuite',
			// @ts-expect-error -- description required by linter
			description: 'Interact with LearningSuite API (powered by agentur-systeme.de)',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'learningSuiteApi',
				required: true,
				testedBy: 'learningSuiteApiTest',
				// @ts-expect-error -- description required by linter
				description: 'LearningSuite API Test',
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
		},
		properties: [
			resourceSelector,
			...apiCallProperties,
			...bundleProperties,
			...communityProperties,
			...courseProperties,
			...groupProperties,
			...hubProperties,
			...memberProperties,
			...moduleProperties,
			...popupProperties,
			...roleProperties,
			...teamMemberProperties,
			...webhookProperties,
		],
	};

	methods = {
		...credentialMethods,
		loadOptions: {
			...loBundle,
			...loCommunity,
			...loCourse,
			...loGroup,
			...loHub,
			...loMember,
			...loModule,
			...loPopup,
			...loRole,
			...loTeamMember,
			...loWebhook,
		},
		resourceMapping: {
			getTemplateVariablesResourceMapperFields,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			try {
				const handler = registry[resource]?.[operation];
				if (!handler) {
					throw new NodeOperationError(
						this.getNode(),
						`No handler for resource "${resource}" and operation "${operation}"`,
					);
				}

				const response = await handler(this, i);

				if (Array.isArray(response)) returnData.push(...response);
				else if (response && typeof response === 'object') returnData.push(response as IDataObject);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: (error as Error).message, input: items[i].json as IDataObject });
					continue;
				}
				if (!(error instanceof Error) || !('name' in error) || String((error as any).name).indexOf('Node') !== 0) {
					throw new NodeOperationError(this.getNode(), (error as Error).message || 'Unknown error');
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
