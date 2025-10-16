import type { INodeProperties } from 'n8n-workflow';

export const webhookProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'getSubscriptions',
		displayOptions: { show: { resource: ['webhook'] } },
		options: [
			{
				name: 'Create Webhook Subscription',
				value: 'createSubscription',
				description: 'Create a webhook subscription to receive events',
				action: 'Create webhook subscription',
			},
			{
				name: 'Delete Webhook Subscription',
				value: 'deleteSubscription',
				description: 'Delete a webhook subscription by ID',
				action: 'Delete webhook subscription',
			},
			{
				name: 'Get Webhook Sample Data',
				value: 'getSampleData',
				description: 'Retrieve sample payloads for supported webhook events',
				action: 'Get webhook sample data',
			},
			{
				name: 'Get Webhook Subscription',
				value: 'getSubscription',
				description: 'Get a webhook subscription by ID',
				action: 'Get webhook subscription',
			},
			{
				name: 'Get Webhook Subscriptions',
				value: 'getSubscriptions',
				description: 'List webhook subscriptions',
				action: 'Get webhook subscriptions',
			},
			{
				name: 'Update Webhook Subscription',
				value: 'updateSubscription',
				description: 'Update a webhook subscription',
				action: 'Update webhook subscription',
			},
		],
	},

	{
		displayName: 'Subscription Name or ID',
		name: 'subscriptionId',
		type: 'options',
		displayOptions: {
			show: { resource: ['webhook'], operation: ['getSubscription', 'updateSubscription', 'deleteSubscription'] },
		},
		typeOptions: { loadOptionsMethod: 'webhook_getSubscriptions' },
		default: '',
		required: true,
		description:
			'ID of the webhook subscription. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	{
		displayName: 'Hook URL',
		name: 'hookUrl',
		type: 'string',
		displayOptions: { show: { resource: ['webhook'], operation: ['createSubscription', 'updateSubscription'] } },
		default: '',
		required: true,
		placeholder: 'https://your-endpoint.com/webhook',
		description: 'URL to send webhook events to',
	},

	{
		displayName: 'Event Type',
		name: 'eventType',
		type: 'options',
		required: true,
		default: 'login.new',
		displayOptions: { show: { resource: ['webhook'], operation: ['createSubscription', 'updateSubscription'] } },
		options: [
			{ name: 'Access Request Created', value: 'accessRequest.created' },
			{ name: 'Community Post Commented', value: 'communityPost.commented' },
			{ name: 'Community Post Created', value: 'communityPost.created' },
			{ name: 'Community Post Moderated', value: 'communityPost.moderated' },
			{ name: 'Course Progress Changed', value: 'courseProgress.changed' },
			{ name: 'Custom Popup Interaction', value: 'customPopup.interaction' },
			{ name: 'Exam Completed', value: 'exam.completed' },
			{ name: 'Exam Graded', value: 'exam.graded' },
			{ name: 'Feedback Created', value: 'feedback.created' },
			{ name: 'Group User Access Changed', value: 'group.userAccessChanged' },
			{ name: 'Lesson Completed', value: 'lesson.completed' },
			{ name: 'New Login', value: 'login.new' },
			{ name: 'Submission Created', value: 'submission.created' },
		],
		description: 'Type of event to subscribe to',
	},

	// --------- Sample Data ---------
	{
		displayName: 'Sample Data Type',
		name: 'sampleDataType',
		type: 'options',
		default: 'feedback-events',
		displayOptions: { show: { resource: ['webhook'], operation: ['getSampleData'] } },
		options: [
			{ name: 'Access Request Created Events', value: 'access-request-created-events' },
			{ name: 'Community Post Commented', value: 'community-post-commented-events' },
			{ name: 'Community Post Created Events', value: 'community-post-created-events' },
			{ name: 'Community Post Moderated Events', value: 'community-post-moderated-events' },
			{ name: 'Course Progress Changed Events', value: 'course-progress-changed-events' },
			{ name: 'Custom Popup Interaction Events', value: 'custom-popup-interaction-events' },
			{ name: 'Exam Completed Events', value: 'exam-completed-events' },
			{ name: 'Exam Graded Events', value: 'exam-graded-events' },
			{ name: 'Feedback Events', value: 'feedback-events' },
			{ name: 'Group User Access Changed Events', value: 'group-user-access-changed-events' },
			{ name: 'Lesson Completed Events', value: 'lesson-completed-events' },
			{ name: 'New Login Events', value: 'new-login-events' },
			{ name: 'Submission Created Events', value: 'submission-created-events' },
		],
		required: true,
		description: 'Type of sample data to retrieve',
	},

	// Login Options
	{
		displayName: 'Login Options',
		name: 'additionalLoginNew',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createSubscription', 'updateSubscription'],
				eventType: ['login.new'],
			},
		},
		options: [
			{
				displayName: 'Login Type',
				name: 'loginType',
				type: 'options',
				default: '',
				description: 'Filter by login type',
				options: [
					{ name: 'All', value: '' },
					{ name: 'App Email Code', value: 'app-email-code' },
					{ name: 'Email & Password', value: 'email-password' },
					{ name: 'Google', value: 'google' },
					{ name: 'Magic Link', value: 'magic-link' },
					{ name: 'OIDC', value: 'oidc' },
					{ name: 'Password Reset', value: 'password-reset' },
				],
			},
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: '',
				description:
					'Optional user filter. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// Custom Popup Interaction
	{
		displayName: 'Popup Interaction Options',
		name: 'additionalPopupInteraction',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createSubscription', 'updateSubscription'],
				eventType: ['customPopup.interaction'],
			},
		},
		options: [
			{
				displayName: 'Popup Name or ID',
				name: 'customPopupId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'popup_getPopups' },
				default: '',
				description:
					'Optional popup filter. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				placeholder: 'Add option',
			},
			{
				displayName: 'Interaction Type',
				name: 'interactionType',
				type: 'options',
				default: '',
				description: 'Filter by interaction type',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Actioned', value: 'actioned' },
					{ name: 'Dismissed', value: 'dismissed' },
				],
			},
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: '',
				description:
					'Optional user filter (only applied if a popup is selected). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// Course Progress Changed
	{
		displayName: 'Course Progress Above (%)',
		name: 'threshold',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 0, maxValue: 100 },
		description: 'Specify the threshold value to trigger (1-100) without the percent sign',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createSubscription', 'updateSubscription'],
				eventType: ['courseProgress.changed'],
			},
		},
	},
	{
		displayName: 'Course Progress Options',
		name: 'additionalCourseProgress',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createSubscription', 'updateSubscription'],
				eventType: ['courseProgress.changed'],
			},
		},
		options: [
			{
				displayName: 'Course Name or ID',
				name: 'courseId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'course_getCourses' },
				default: '',
				description:
					'Optional course filter. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// Community Post Created
	{
		displayName: 'Community Post (Created) Options',
		name: 'additionalCommunityPostCreated',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createSubscription', 'updateSubscription'],
				eventType: ['communityPost.created'],
			},
		},
		options: [
			{
				displayName: 'Area Name or ID',
				name: 'areaId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'community_getAreas' },
				default: '',
				placeholder: 'Add option',
			},
			{
				displayName: 'Forum Name or ID',
				name: 'forumId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'community_getForums',
					loadOptionsDependsOn: ['additionalCommunityPostCreated.areaId'],
				},
				default: '',
			},
			{
				displayName: 'Publish Status',
				name: 'publishStatus',
				type: 'options',
				options: [
					{ name: 'Both', value: 'both' },
					{ name: 'Published', value: 'published' },
					{ name: 'Waiting for Moderation', value: 'waiting for moderation' },
				],
				default: 'both',
			},
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: '',
				description:
					'Optional user filter. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// Community Post Commented
	{
		displayName: 'Community Post (Commented) Options',
		name: 'additionalCommunityPostCommented',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createSubscription', 'updateSubscription'],
				eventType: ['communityPost.commented'],
			},
		},
		options: [
			{
				displayName: 'Area Name or ID',
				name: 'areaId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'community_getAreas' },
				default: '',
				placeholder: 'Add option',
			},
			{
				displayName: 'Forum Name or ID',
				name: 'forumId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'community_getForums',
					loadOptionsDependsOn: ['additionalCommunityPostCreated.areaId'],
				},
				default: '',
			},
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: '',
				description:
					'Optional user filter. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// Community Post Moderated
	{
		displayName: 'Community Post (Moderated) Options',
		name: 'additionalCommunityPostModerated',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createSubscription', 'updateSubscription'],
				eventType: ['communityPost.moderated'],
			},
		},
		options: [
			{
				displayName: 'Area Name or ID',
				name: 'areaId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'community_getAreas' },
				default: '',
				placeholder: 'Add option',
			},
			{
				displayName: 'Forum Name or ID',
				name: 'forumId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'community_getForums',
					loadOptionsDependsOn: ['additionalCommunityPostModerated.areaId'],
				},
				default: '',
			},
			{
				displayName: 'Approved Status',
				name: 'approved',
				type: 'options',
				options: [
					{ name: 'Both', value: 'both' },
					{ name: 'Approved (Yes)', value: 'approved' },
					{ name: 'Rejected (No)', value: 'rejected' },
				],
				default: 'both',
			},
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: '',
				description:
					'Optional user filter. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// Feedback / Exam (optional course)
	{
		displayName: 'Feedback/Exam Options',
		name: 'additionalFeedbackExam',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createSubscription', 'updateSubscription'],
				eventType: ['feedback.created', 'exam.completed', 'exam.graded'],
			},
		},
		options: [
			{
				displayName: 'Course Name or ID',
				name: 'courseId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'course_getCourses' },
				default: '',
				description:
					'Optional course filter. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// Access Request Course (required)
	{
		displayName: 'Course Name or ID',
		name: 'courseId',
		type: 'options',
		required: true,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: { loadOptionsMethod: 'course_getCourses' },
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createSubscription', 'updateSubscription'],
				eventType: ['accessRequest.created'],
			},
		},
	},

	// Group User Access Changed
	{
		displayName: 'Action',
		name: 'actionType',
		type: 'options',
		default: 'added',
		options: [
			{ name: 'Added', value: 'added' },
			{ name: 'Removed', value: 'removed' },
		],
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createSubscription', 'updateSubscription'],
				eventType: ['group.userAccessChanged'],
			},
		},
	},
	{
		displayName: 'Group Access Options',
		name: 'additionalGroupAccess',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createSubscription', 'updateSubscription'],
				eventType: ['group.userAccessChanged'],
			},
		},
		options: [
			{
				displayName: 'Group Name or ID',
				name: 'groupId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'group_getGroups' },
				default: '',
			},
		],
	},

	// Lesson Completed
	{
		displayName: 'Lesson Completed Options',
		name: 'additionalLessonCompleted',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createSubscription', 'updateSubscription'],
				eventType: ['lesson.completed'],
			},
		},
		options: [
			{
				displayName: 'Course Name or ID',
				name: 'courseId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'course_getCourses' },
				default: '',
			},
			{
				displayName: 'Module Name or ID',
				name: 'moduleId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'course_getModules',
					loadOptionsDependsOn: ['additionalLessonCompleted.courseId'],
				},
				default: '',
			},
			{
				displayName: 'Lesson Name or ID',
				name: 'lessonId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'module_getLessons',
					loadOptionsDependsOn: ['additionalLessonCompleted.moduleId'],
				},
				default: '',
			},
		],
	},

	// Submission Created
	{
		displayName: 'Submission Options',
		name: 'additionalSubmission',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createSubscription', 'updateSubscription'],
				eventType: ['submission.created'],
			},
		},
		options: [
			{
				displayName: 'Course Name or ID',
				name: 'courseId',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'course_getCourses' },
				default: '',
			},
		],
	},
];
