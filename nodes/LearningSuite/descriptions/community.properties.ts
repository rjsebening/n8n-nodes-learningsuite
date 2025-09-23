import type { INodeProperties } from 'n8n-workflow';

export const communityProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'getAreas',
		displayOptions: { show: { resource: ['community'] } },
		options: [
			{
				name: 'Assign Badges to Member',
				value: 'assignBadgesToUser',
				description: 'Assign one or more badges to a member',
				action: 'Assign badges to member',
			},
			{
				name: 'Get Community Areas',
				value: 'getAreas',
				description: 'List community areas',
				action: 'Get community areas',
			},
			{
				name: 'Get Community Badges',
				value: 'getBadges',
				description: 'List community badges (optionally filtered by badge group)',
				action: 'Get community badges',
			},
			{
				name: 'Get Community Forums',
				value: 'getForums',
				description: 'List community forums (optionally filtered by area)',
				action: 'Get community forums',
			},
			{
				name: 'Remove Community Badges From Member',
				value: 'removeBadgesFromUser',
				description: 'Remove one or more badges from a member',
				action: 'Remove badges from member',
			},
		],
	},
	{
		displayName: 'Area Name or ID',
		name: 'areaId',
		type: 'options',
		displayOptions: { show: { resource: ['community'], operation: ['getForums'] } },
		default: '',
		typeOptions: { loadOptionsMethod: 'community_getAreas' },
		description:
			'ID of the community area to filter forums. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		description: 'Max number of results to return',
		displayOptions: {
			show: { resource: ['community', 'popup', 'member'], operation: ['getAreas', 'getForums', 'getAll'] },
		},
		typeOptions: { minValue: 1 },
		default: 50,
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		displayOptions: {
			show: { resource: ['community', 'popup', 'member'], operation: ['getAreas', 'getForums', 'getAll'] },
		},
		typeOptions: { minValue: 0 },
		default: 0,
		description: 'Number of results to skip for pagination',
	},
	// Optional filter for badges (for listing + for LoadOptions when assigning/removing)
	{
		displayName: 'Badge Group ID',
		name: 'badgeGroupId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['community'],
				operation: ['getBadges', 'assignBadgesToUser', 'removeBadgesFromUser'],
			},
		},
		default: '',
		description: 'If set, only badges from this badge group will be used/displayed',
	},

	// Paging for GET /community/badges (you can extend your existing limit/offset props or add them)
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['community'],
				operation: ['getBadges'],
			},
		},
		typeOptions: { minValue: 1 },
		default: 50, // according to the API default
		description: 'Max number of results to return',
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		displayOptions: {
			show: { resource: ['community'], operation: ['getBadges'] },
		},
		typeOptions: { minValue: 0 },
		default: 0, // according to the API default
		description: 'Number of badges to skip (pagination)',
	},

	// Member selection for assign/remove
	{
		displayName: 'Member Name or ID',
		name: 'memberId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'member_getMembers' },
		displayOptions: {
			show: { resource: ['community'], operation: ['assignBadgesToUser', 'removeBadgesFromUser'] },
		},
		default: '',
		required: true,
		description:
			'Member to whom badges are assigned or revoked. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// Badges (multi-select) – depends on optional badgeGroupId filter
	{
		displayName: 'Badge Names or IDs',
		name: 'badgeIds',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'community_getBadges',
			loadOptionsDependsOn: ['badgeGroupId'],
		},
		displayOptions: {
			show: { resource: ['community'], operation: ['assignBadgesToUser', 'removeBadgesFromUser'] },
		},
		default: [],
		required: true,
		description:
			'Select one or more badges. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	{
		displayName:
			'You can select multiple badges. The badge selector can optionally be filtered by <b>Badge Group ID</b>.',
		name: 'notice',
		type: 'notice',
		displayOptions: {
			show: { resource: ['community'], operation: ['assignBadgesToUser', 'removeBadgesFromUser'] },
		},
		default: '',
		description:
			'You can select multiple badges. The badge selector can optionally be filtered by <b>Badge Group ID</b>.',
	},
];
