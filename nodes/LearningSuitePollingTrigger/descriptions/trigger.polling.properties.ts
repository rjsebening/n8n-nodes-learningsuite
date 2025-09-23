import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName:
			'This workflow will run on the schedule you define here once you <a data-key="activate">activate</a> it.<br><br>For testing, you can also trigger it manually: by going back to the canvas and clicking \'execute workflow\'',
		name: 'notice',
		type: 'notice',
		default: '',
	},
	{
		displayName: 'Event',
		name: 'event',
		type: 'options',
		default: 'bundle.created',
		description: 'Which LearningSuite event should trigger the node',
		options: [
			{ name: 'Bundle Created', value: 'bundle.created', description: 'Triggers when a new bundle has been created' },
			{
				name: 'Custom Popup Created',
				value: 'customPopup.created',
				description: 'Triggers when a new custom popup has been added to the platform',
			},
			{ name: 'Group Created', value: 'group.created', description: 'Triggers when a new group has been created' },
			{
				name: 'New Community Area',
				value: 'community.area.created',
				description: 'Triggers when a new community area is created',
			},
			{
				name: 'New Community Badge',
				value: 'community.badge.created',
				description: 'Triggers when a new community badge is created',
			},
			{
				name: 'New Community Forum',
				value: 'community.forum.created',
				description: 'Triggers when a new community forum is created',
			},
			{
				name: 'New Member Created',
				value: 'member.created',
				description: 'Triggers when a new member has been added to the platform',
			},
			{
				name: 'Member Not Logged In for More Than X Days',
				value: 'member.inactiveForXDays',
				description: 'Triggers when a member has not logged in to the platform for more than the specified amount of days',
			},
		],
	},
	{
		displayName: 'Community Forum Options',
		name: 'additionalCommunityForum',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['community.forum.created'] } },
		options: [
			{
				displayName: 'Area Name or ID',
				name: 'areaId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'community_getAreas' },
				default: '',
			},
		],
	},
	{
		displayName: 'Not Logged in for Days',
		name: 'inactiveDays',
		type: 'number',
		default: 5,
		typeOptions: { minValue: 1 },
		description: 'Enter the minimum of days the user has not logged in to the platform',
		displayOptions: { show: { event: ['user.inactiveForXDays'] } },
	},
	{
		displayName: 'Include Users Who Have Not Logged in Yet',
		name: 'includeNeverLoggedIn',
		type: 'boolean',
		default: true,
		displayOptions: { show: { event: ['user.inactiveForXDays'] } },
		description:
			'Whether choose if users who have been added to the platform but have not logged in yet should be included',
	},
];
