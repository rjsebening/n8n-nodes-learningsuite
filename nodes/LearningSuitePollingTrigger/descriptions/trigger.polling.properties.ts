// n8n-nodes-learningsuite/nodes/LearningSuitePollingTrigger/descriptions/trigger.polling.properties.ts

import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName:
			'This trigger runs on the schedule you define once the workflow is activated.<br><br>You can also test it manually by clicking Execute workflow in the editor.',
		name: 'noticeGeneral',
		type: 'notice',
		default: '',
	},
	{
		displayName: 'Event',
		name: 'event',
		type: 'options',
		default: 'bundle.created',
		description: 'Select which LearningSuite event should trigger this workflow',
		options: [
			{
				name: 'Bundle Created',
				value: 'bundle.created',
				description: 'Triggers when a new bundle is created',
			},
			{
				name: 'Community Area Created',
				value: 'community.area.created',
				description: 'Triggers when a new community area is created',
			},
			{
				name: 'Community Badge Created',
				value: 'community.badge.created',
				description: 'Triggers when a new community badge is created',
			},
			{
				name: 'Community Forum Created',
				value: 'community.forum.created',
				description: 'Triggers when a new community forum is created',
			},
			{
				name: 'Custom Field Card Created',
				value: 'customField.card.created',
				description: 'Triggers when a new custom field card is created',
			},
			{
				name: 'Custom Popup Created',
				value: 'customPopup.created',
				description: 'Triggers when a new custom popup is added',
			},
			{
				name: 'Group Created',
				value: 'group.created',
				description: 'Triggers when a new group is created',
			},
			{
				name: 'Member Created',
				value: 'member.created',
				description: 'Triggers when a new member is added to the platform',
			},
			{
				name: 'Member Not Logged In for More Than X Days',
				value: 'member.inactiveForXDays',
				description:
					'Triggers when a member has not logged in to the platform for more than the specified number of days',
			},
			{
				name: 'Team Member Created',
				value: 'teamMember.created',
				description: 'Triggers when a new team member has been added to the platform',
			},
			{
				name: 'Team Member Updated',
				value: 'teamMember.updated',
				description: 'Triggers when an existing team member is updated',
			},
		],
	},
	{
		displayName:
			'This trigger can either fire once per inactivity phase or on every polling interval, depending on the selected trigger mode.',
		name: 'inactiveTriggerModeNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				event: ['member.inactiveForXDays'],
			},
		},
	},
	{
		displayName: 'Trigger Mode',
		name: 'inactiveTriggerMode',
		type: 'options',
		default: 'once',
		displayOptions: {
			show: {
				event: ['member.inactiveForXDays'],
			},
		},
		options: [
			{
				name: 'Once per Inactivity Phase (Recommended)',
				value: 'once',
				description:
					'Triggers once when the inactivity threshold is reached. Will trigger again only after the member logs in and becomes inactive again.',
			},
			{
				name: 'Recurring (Every Poll)',
				value: 'recurring',
				description:
					'Triggers on every polling interval and returns all members that are inactive for more than the specified number of days',
			},
		],
	},
	{
		displayName: 'Community Forum Options',
		name: 'additionalCommunityForum',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: {
			show: {
				event: ['community.forum.created'],
			},
		},
		options: [
			{
				displayName: 'Area Name or ID',
				name: 'areaId',
				type: 'options',
				default: '',
				description:
					'Choose a community area from the list or provide an Area ID using an expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'community_getAreas',
				},
			},
		],
	},
	{
		displayName: 'Inactive for Days',
		name: 'inactiveDays',
		type: 'number',
		default: 7,
		typeOptions: {
			minValue: 1,
		},
		description: 'Number of days a member has not logged in',
		displayOptions: {
			show: {
				event: ['member.inactiveForXDays'],
			},
		},
	},

	{
		displayName: 'Include Members Who Never Logged In',
		name: 'includeNeverLoggedIn',
		type: 'boolean',
		default: true,
		description: 'Whether members who have never logged in should be included',
		displayOptions: {
			show: {
				event: ['member.inactiveForXDays'],
			},
		},
	},
	{
		displayName: 'Max Members Per Poll',
		name: 'memberLimit',
		type: 'number',
		default: 500,
		typeOptions: {
			minValue: 100,
			maxValue: 1000,
		},
		description: 'Maximum number of members fetched per polling run. Lower values reduce API load.',
		displayOptions: {
			show: {
				event: ['member.inactiveForXDays'],
			},
		},
	},
	{
		displayName: 'Max Pages',
		name: 'memberMaxPages',
		type: 'number',
		default: 10,
		typeOptions: {
			minValue: 1,
			maxValue: 50,
		},
		description: 'Maximum number of pagination pages per polling run',
		displayOptions: {
			show: {
				event: ['member.inactiveForXDays'],
			},
		},
	},
];
