import type { INodeProperties } from 'n8n-workflow';

export const hubProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'getAll',
		displayOptions: { show: { resource: ['hub'] } },
		options: [
			{ name: 'Create Hub', value: 'create', description: 'Create a new hub from a template', action: 'Create a hub' },
			{
				name: 'Get Hub Template Variables',
				value: 'getTemplateVariables',
				description: 'List variables required by the selected hub template',
				action: 'Get hub template variables',
			},
			{
				name: 'Get Hub Templates',
				value: 'getTemplates',
				description: 'List hub templates',
				action: 'Get hub templates',
			},
			{ name: 'Get Many', value: 'getAll', description: 'List published hubs', action: 'Get many hubs' },
			{
				name: 'Give Hub Access',
				value: 'addAccess',
				description: 'Grant hub access to selected members, groups, or bundles',
				action: 'Add hub access',
			},
			{
				name: 'Remove Hub Access',
				value: 'removeAccess',
				description: 'Remove hub access for selected members, groups, or bundles',
				action: 'Remove hub access',
			},
		],
	},
	{
		displayName: 'Hub Name or ID',
		name: 'hubId',
		type: 'options',
		displayOptions: { show: { resource: ['hub'], operation: ['addAccess', 'removeAccess'] } },
		typeOptions: { loadOptionsMethod: 'hub_getHubs' },
		default: '',
		required: true,
		description:
			'ID of the hub. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName:
			'You can grant/remove access via <b>Members</b>, <b>Groups</b>, or <b>Bundles</b> – or in combination. At least one selection is required.',
		name: 'notice',
		type: 'notice',
		displayOptions: { show: { resource: ['hub'], operation: ['addAccess', 'removeAccess'] } },
		default: '',
	},

	{
		displayName: 'Hub Name',
		name: 'name',
		type: 'string',
		displayOptions: { show: { resource: ['hub'], operation: ['create'] } },
		default: '',
		required: true,
		description: 'Name of the hub',
	},
	{
		displayName: 'Template Name or ID',
		name: 'templateId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'hub_getTemplates' },
		displayOptions: { show: { resource: ['hub'], operation: ['create', 'getTemplateVariables'] } },
		default: '',
		required: true,
		description:
			'ID of the hub template. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['hub'], operation: ['create'] } },
		options: [
			{
				displayName: 'Hub Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the hub',
			},
			{
				displayName: 'Publish Hub',
				name: 'publish',
				type: 'boolean',
				default: true,
				description: 'Whether to publish the hub immediately',
			},
			{
				displayName: 'Sort Index',
				name: 'sortIndex',
				type: 'number',
				default: 0,
				description: 'Sort index of the hub',
			},
			{
				displayName: 'Template Variables',
				name: 'templateVariables',
				type: 'json',
				default: {},
				description: 'Optional template variables as JSON',
			},
		],
	},
	{
		displayName: 'Group Names or IDs',
		name: 'groupIds',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'group_getGroups' },
		displayOptions: { show: { resource: ['hub'], operation: ['addAccess', 'removeAccess'] } },
		default: [],
		description:
			'Comma-separated list of group IDs. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Bundle Names or IDs',
		name: 'bundleIds',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'bundle_getBundles' },
		displayOptions: { show: { resource: ['hub'], operation: ['addAccess', 'removeAccess'] } },
		default: [],
		description:
			'Select bundles to grant/remove access. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Member Names or IDs',
		name: 'memberIds',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'member_getMembers' },
		displayOptions: { show: { resource: ['hub'], operation: ['addAccess', 'removeAccess'] } },
		default: [],
		description:
			'Select members to grant/remove access. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];
