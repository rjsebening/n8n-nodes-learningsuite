import {
	ICredentialTestFunctions,
	ICredentialsDecrypted,
	ICredentialDataDecryptedObject,
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeConnectionType,
	IDataObject,
	NodeApiError,
	JsonObject,
} from 'n8n-workflow';

// Lokaler Typ, da nicht exportiert in allen n8n-Versionen
export interface INodeCredentialTestResult {
	status: 'OK' | 'Error';
	message: string; // Pflichtfeld!
}

export class LearningSuiteTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LearningSuite Trigger',
		name: 'learningSuiteTrigger',
		icon: 'fa:book',
		group: ['trigger'],
		version: 1,
		description: 'Trigger node for LearningSuite events',
		subtitle: '={{$parameter["event"]}}',
		defaults: {
			name: 'LearningSuite Trigger',
			// @ts-expect-error -- description is required by nodelinter but missing in type definition
			description: 'Trigger node for LearningSuite events',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'learningSuiteApi',
				required: true,
				testedBy: 'learningSuiteApiTest',
				// @ts-expect-error -- description is required by nodelinter but missing in type definition
				description: 'LearningSuite API Test',
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: '/',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				default: 'communityPost.created',
				required: true,
				description: 'The event type to listen for',
				options: [
					{
						name: 'Community Post Created',
						value: 'communityPost.created',
						description: 'Triggered when a community post is created.',
					},
					{
						name: 'Community Post Moderated',
						value: 'communityPost.moderated',
						description: 'Triggered when a community post is moderated.',
					},
					{
						name: 'Custom Popup Interaction',
						value: 'custom.popup.interaction',
						description: 'Triggered when a user interacts with a custom popup.',
					},
					{
						name: 'Exam Completed',
						value: 'exam.completed',
						description: 'Triggered when a user completes an exam.',
					},
					{
						name: 'Exam Graded',
						value: 'exam.graded',
						description: 'Triggered when an exam is graded.',
					},
					{
						name: 'Feedback Created',
						value: 'feedback.created',
						description: 'Triggered when feedback is created.',
					},
					{
						name: 'Group User Access Changed',
						value: 'group.userAccessChanged',
						description: 'Triggered when group user access rights change.',
					},
					{
						name: 'Lesson Completed',
						value: 'lesson.completed',
						description: 'Triggered when a user completes a lesson.',
					},
					{
						name: 'Member Not Logged In for X Days',
						value: 'member.notLoggedInXDays',
						description:
							'Triggered when a member hasn’t logged in for a defined number of days.',
					},
					{
						name: 'New Login',
						value: 'new.login',
						description: 'Triggered when a user logs in.',
					},
					{
						name: 'Progress Changed',
						value: 'progress.changed',
						description: 'Triggered when a user’s progress changes.',
					},
				],
			},

			// Community Post Filters
			{
				displayName: 'Area ID',
				name: 'areaId',
				type: 'string',
				default: '',
				displayOptions: {
					show: { event: ['communityPost.created', 'communityPost.moderated'] },
				},
				description: 'Filter by community area ID',
			},
			{
				displayName: 'Forum ID',
				name: 'forumId',
				type: 'string',
				default: '',
				displayOptions: {
					show: { event: ['communityPost.created', 'communityPost.moderated'] },
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
				displayOptions: { show: { event: ['communityPost.moderated'] } },
				description: 'Filter by approval status',
			},

			// Group User Access Changed Filters
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				default: '',
				displayOptions: { show: { event: ['group.userAccessChanged'] } },
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
				displayOptions: { show: { event: ['group.userAccessChanged'] } },
				description: 'Filter by action type',
			},

			// Course Instance Filter
			{
				displayName: 'Course Instance ID',
				name: 'courseInstanceId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						event: [
							'lesson.completed',
							'feedback.created',
							'progress.changed',
							'exam.completed',
							'exam.graded',
						],
					},
				},
				description: 'Filter by course instance ID',
			},

			// Popup Filter
			{
				displayName: 'Popup ID',
				name: 'popupId',
				type: 'string',
				default: '',
				displayOptions: { show: { event: ['custom.popup.interaction'] } },
				description: 'Filter by popup ID',
			},

			// Member Not Logged In X Days Filters
			{
				displayName: 'Days Not Logged In',
				name: 'days',
				type: 'number',
				default: 7,
				required: true,
				displayOptions: { show: { event: ['member.notLoggedInXDays'] } },
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
				displayOptions: { show: { event: ['member.notLoggedInXDays'] } },
				description: 'Whether to include members who have never logged in',
			},
		],
	};

	methods = {
		credentialTest: {
			async learningSuiteApiTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted<ICredentialDataDecryptedObject>,
			): Promise<INodeCredentialTestResult> {
				if (!credential.data) {
					return {
						status: 'Error',
						message: 'No credential data found',
					};
				}

				try {
					await this.helpers.request({
						method: 'GET',
						url: `${credential.data.baseUrl}/auth`,
						headers: {
							'X-API-KEY': credential.data.apiKey as string,
						},
					});
					return {
						status: 'OK',
						message: 'Authentication successful!',
					};
				} catch {
					return {
						status: 'Error',
						message: 'Authentication failed',
					};
				}
			},
		},
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

				const body: IDataObject = {
					hookUrl: webhookUrl,
					type: event,
					default: '',
				};

				const filter: IDataObject = {};
				let hasFilter = false;

				// Community Post filters
				if (
					event === 'communityPost.created' ||
					event === 'communityPost.moderated'
				) {
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
						const approved = this.getNodeParameter('approved', '') as
							| string
							| boolean;
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

				// Course Instance filter
				if (
					[
						'lesson.completed',
						'progress.changed',
						'feedback.created',
						'exam.completed',
						'exam.graded',
					].includes(event)
				) {
					const courseInstanceId = this.getNodeParameter(
						'courseInstanceId',
						'',
					) as string;
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

				// Member Not Logged In filter
				if (event === 'member.notLoggedInXDays') {
					const days = this.getNodeParameter('days') as number;
					const includeNeverLoggedIn = this.getNodeParameter(
						'includeNeverLoggedIn',
						false,
					) as boolean;

					filter.days = days;
					filter.includeNeverLoggedIn = includeNeverLoggedIn;
					hasFilter = true;
				}

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

					const webhookData = this.getWorkflowStaticData('node');
					webhookData.subscriptionId = response.id;
					return true;
				} catch (error) {
					throw new NodeApiError(this.getNode(), error as JsonObject, {
						message: 'Failed to create webhook subscription',
					});
				}
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (!webhookData.subscriptionId) {
					return true;
				}

				try {
					await this.helpers.requestWithAuthentication.call(
						this,
						'learningSuiteApi',
						{
							method: 'DELETE',
							url: `/webhooks/subscription/${webhookData.subscriptionId}`,
						},
					);

					delete webhookData.subscriptionId;
					return true;
				} catch (error) {
					delete webhookData.subscriptionId;
					throw new NodeApiError(this.getNode(), error as JsonObject, {
						message: 'Failed to delete webhook subscription',
					});
				}
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();

		if (!body || (Array.isArray(body) && body.length === 0)) {
			return {
				workflowData: [
					this.helpers.returnJsonArray([{ error: 'No data received' }]),
				],
			};
		}

		return {
			workflowData: [this.helpers.returnJsonArray(body)],
		};
	}
}
