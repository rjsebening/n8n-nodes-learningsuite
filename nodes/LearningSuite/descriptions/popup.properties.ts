import type { INodeProperties } from 'n8n-workflow';

export const popupProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'getAll',
		displayOptions: { show: { resource: ['popup'] } },
		options: [
			{ name: 'Get Popup', value: 'get', description: 'Get a popup by ID', action: 'Get a popup' },
			{ name: 'Get Many', value: 'getAll', description: 'List popups (paginated)', action: 'Get many popups' },
			{
				name: 'Delete Popup Trigger',
				value: 'removeTriggerForMember',
				description: 'Remove a popup trigger for a member',
				action: 'Remove popup trigger for member',
			},
			{
				name: 'Trigger Popup for Member',
				value: 'triggerForMember',
				description: 'Trigger a popup for a member',
				action: 'Trigger popup for member',
			},
		],
	},
	{
		displayName: 'Popup Name or ID',
		name: 'popupId',
		type: 'options',
		displayOptions: { show: { resource: ['popup'], operation: ['get', 'triggerForMember', 'removeTriggerForMember'] } },
		default: '',
		typeOptions: { loadOptionsMethod: 'popup_getPopups' },
		required: true,
		description:
			'ID or SID of the popup. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Member Name or ID',
		name: 'memberId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'member_getMembers' },
		displayOptions: {
			show: { resource: ['popup'], operation: ['triggerForMember', 'removeTriggerForMember'] },
		},
		default: '',
		required: true,
		description:
			'Member to trigger/remove popup for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		description: 'Max number of results to return',
		displayOptions: {
			show: { resource: ['popup'], operation: ['getAll'] },
		},
		typeOptions: { minValue: 1 },
		default: 50,
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		displayOptions: {
			show: { resource: ['popup'], operation: ['getAll'] },
		},
		typeOptions: { minValue: 0 },
		default: 0,
		description: 'Number of results to skip for pagination',
	},
];
