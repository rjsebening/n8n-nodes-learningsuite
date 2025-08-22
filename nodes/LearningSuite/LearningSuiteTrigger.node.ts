import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeConnectionType,
} from 'n8n-workflow';

export class LearningSuiteTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LearningSuite Trigger',
		name: 'learningSuiteTrigger',
		icon: 'fa:book',
		group: ['trigger'],
		version: 1,
		description: 'Triggers on events in LearningSuite',
		defaults: {
			name: 'LearningSuite Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'learningSuiteApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'lesson.completed',
				options: [
					{ name: 'Lesson Completed', value: 'lesson.completed' },
					{ name: 'Progress Changed', value: 'progress.changed' },
					{ name: 'Feedback Created', value: 'feedback.created' },
					{ name: 'New Login', value: 'new.login' },
					{ name: 'Exam Completed', value: 'exam.completed' },
					{ name: 'Exam Graded', value: 'exam.graded' },
					{ name: 'Custom Popup Interaction', value: 'custom.popup.interaction' },
					{ name: 'Community Post Created', value: 'communityPost.created' },
					{ name: 'Community Post Moderated', value: 'communityPost.moderated' },
					{ name: 'Group User Access Changed', value: 'group.userAccessChanged' },
					{ name: 'Member Not Logged In for X Days', value: 'member.notLoggedInXDays' },
				],
				description: 'The event type to listen for',
			},

			// Community Post Moderated Filters
			{
				displayName: 'Area ID',
				name: 'areaId',
				type: 'string',
				default: '',
				displayOptions: { 
					show: { 
						event: ['communityPost.created', 'communityPost.moderated'] 
					} 
				},
				description: 'Filter by community area ID',
			},
			{
				displayName: 'Forum ID',
				name: 'forumId',
				type: 'string',
				default: '',
				displayOptions: { 
					show: { 
						event: ['communityPost.created', 'communityPost.moderated'] 
					} 
				},
				description: 'Filter by forum ID',
			},
			{
				displayName: 'Approved Status',
				name: 'approved',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Approved', value: true },
					{ name: 'Not Approved', value: false },
				],
				default: '',
				displayOptions: { 
					show: { 
						event: ['communityPost.moderated'] 
					} 
				},
				description: 'Filter by approval status',
			},

			// Group User Access Changed Filters
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				default: '',
				displayOptions: { 
					show: { 
						event: ['group.userAccessChanged'] 
					} 
				},
				description: 'Filter by specific group ID',
			},
			{
				displayName: 'Action Type',
				name: 'actionType',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Added', value: 'added' },
					{ name: 'Removed', value: 'removed' },
				],
				default: '',
				displayOptions: { 
					show: { 
						event: ['group.userAccessChanged'] 
					} 
				},
				description: 'Filter by action type',
			},

			// Course Instance Filter for various events
			{
				displayName: 'Course Instance ID',
				name: 'courseInstanceId',
				type: 'string',
				default: '',
				displayOptions: { 
					show: { 
						event: ['lesson.completed', 'progress.changed', 'exam.completed', 'exam.graded'] 
					} 
				},
				description: 'Filter by course instance ID',
			},

			// Popup ID Filter
			{
				displayName: 'Popup ID',
				name: 'popupId',
				type: 'string',
				default: '',
				displayOptions: { 
					show: { 
						event: ['custom.popup.interaction'] 
					} 
				},
				description: 'Filter by popup ID',
			},

			// Member Not Logged In X Days Filters
			{
				displayName: 'Days Not Logged In',
				name: 'days',
				type: 'number',
				default: 7,
				required: true,
				displayOptions: { 
					show: { 
						event: ['member.notLoggedInXDays'] 
					} 
				},
				typeOptions: {
					minValue: 1,
					maxValue: 365,
				},
				description: 'Number of days a member has not logged in',
			},
			{
				displayName: 'Include Never Logged In',
				name: 'includeNeverLoggedIn',
				type: 'boolean',
				default: false,
				displayOptions: { 
					show: { 
						event: ['member.notLoggedInXDays'] 
					} 
				},
				description: 'Include members who have never logged in',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				return Boolean(webhookData.subscriptionId);
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const event = this.getNodeParameter('event') as string;

				const body: any = {
					hookUrl: webhookUrl,
					type: event,
				};

				// Build filter object based on event type
				const filter: any = {};
				let hasFilter = false;

				// Community Post filters
				if (event === 'communityPost.created' || event === 'communityPost.moderated') {
					const areaId = this.getNodeParameter('areaId', '') as string;
					const forumId = this.getNodeParameter('forumId', '') as string;
					
					if (areaId) {
						filter.areaId = areaId;
						hasFilter = true;
					}
					if (forumId) {
						filter.forumId = forumId;
						hasFilter = true;
					}
					
					if (event === 'communityPost.moderated') {
						const approved = this.getNodeParameter('approved', '') as string | boolean;
						if (approved !== '') {
							filter.approved = approved;
							hasFilter = true;
						}
					}
				}

				// Group User Access Changed filters
				if (event === 'group.userAccessChanged') {
					const groupId = this.getNodeParameter('groupId', '') as string;
					const actionType = this.getNodeParameter('actionType', '') as string;
					
					if (groupId) {
						filter.groupId = groupId;
						hasFilter = true;
					}
					if (actionType) {
						filter.actionType = actionType;
						hasFilter = true;
					}
				}

				// Course Instance filter for learning events
				if (['lesson.completed', 'progress.changed', 'exam.completed', 'exam.graded'].includes(event)) {
					const courseInstanceId = this.getNodeParameter('courseInstanceId', '') as string;
					if (courseInstanceId) {
						filter.courseInstanceId = courseInstanceId;
						hasFilter = true;
					}
				}

				// Popup filter
				if (event === 'custom.popup.interaction') {
					const popupId = this.getNodeParameter('popupId', '') as string;
					if (popupId) {
						filter.popupId = popupId;
						hasFilter = true;
					}
				}

				// Member Not Logged In X Days filter
				if (event === 'member.notLoggedInXDays') {
					const days = this.getNodeParameter('days') as number;
					const includeNeverLoggedIn = this.getNodeParameter('includeNeverLoggedIn', false) as boolean;
					
					filter.days = days;
					filter.includeNeverLoggedIn = includeNeverLoggedIn;
					hasFilter = true;
				}

				// Add filter to body if any filters were set
				if (hasFilter) {
					body.filter = filter;
				}

				try {
					const response = await this.helpers.requestWithAuthentication.call(
						this,
						'learningSuiteApi',
						{
							method: 'POST',
							url: '/webhooks/subscription',
							body,
						},
					);

					// Store subscription ID for cleanup
					const webhookData = this.getWorkflowStaticData('node');
					webhookData.subscriptionId = response.id;
					return true;
				} catch (error) {
					console.error('Failed to create webhook subscription:', error);
					return false;
				}
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				
				if (!webhookData.subscriptionId) {
					return true; // Nothing to delete
				}

				try {
					await this.helpers.requestWithAuthentication.call(
						this, 
						'learningSuiteApi', 
						{
							method: 'DELETE',
							url: `/webhooks/subscription/${webhookData.subscriptionId}`,
						}
					);

					// Clear stored subscription ID
					delete webhookData.subscriptionId;
					return true;
				} catch (error) {
					console.error('Failed to delete webhook subscription:', error);
					// Even if deletion fails, clear the stored ID
					delete webhookData.subscriptionId;
					return false;
				}
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();
		
		// Validate that we received data
		if (!body || (Array.isArray(body) && body.length === 0)) {
			return {
				workflowData: [this.helpers.returnJsonArray([{ error: 'No data received' }])],
			};
		}

		// Return the webhook data
		return {
			workflowData: [this.helpers.returnJsonArray(body)],
		};
	}
}