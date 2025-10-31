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
				action: 'Create webhook subscription',
				description: 'Create a webhook subscription to receive events',
			},
			{
				name: 'Delete Webhook Subscription',
				value: 'deleteSubscription',
				action: 'Delete webhook subscription',
				description: 'Delete a webhook subscription by ID',
			},
			{
				name: 'Get Webhook Sample Data',
				value: 'getSampleData',
				action: 'Get webhook sample data',
				description: 'Retrieve sample payloads for supported webhook events',
			},
			{
				name: 'Get Webhook Subscription',
				value: 'getSubscription',
				action: 'Get webhook subscription',
				description: 'Get a webhook subscription by ID',
			},
			{
				name: 'Get Webhook Subscriptions',
				value: 'getSubscriptions',
				action: 'Get webhook subscriptions',
				description: 'List webhook subscriptions',
			},
			{
				name: 'Update Webhook Subscription',
				value: 'updateSubscription',
				action: 'Update webhook subscription',
				description: 'Update a webhook subscription',
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
		displayName: 'Webhook URL',
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
		default: 'communityPost.created',
		displayOptions: { show: { resource: ['webhook'], operation: ['createSubscription', 'updateSubscription'] } },
		description: 'Type of event to subscribe to',
		options: [
			{ name: 'Community Post Commented', value: 'communityPost.commented' },
			{ name: 'Community Post Created', value: 'communityPost.created' },
			{ name: 'Community Post Moderated', value: 'communityPost.moderated' },
			{ name: 'Course Progress Changed', value: 'courseProgress.changed' },
			{ name: 'Custom Popup Interaction', value: 'customPopup.interaction' },
			{ name: 'Exam Completed', value: 'exam.completed' },
			{ name: 'Exam Graded', value: 'exam.graded' },
			{ name: 'Group User Access Changed', value: 'group.userAccessChanged' },
			{ name: 'Lesson Completed', value: 'lesson.completed' },
			{ name: 'New Access Request', value: 'accessRequest.created' },
			{ name: 'New Feedback Created', value: 'feedback.created' },
			{ name: 'New Login', value: 'login.new' },
			{ name: 'Submission Created', value: 'submission.created' },
		],
	},

	// --------- Sample Data ---------
	{
		displayName: 'Sample Data Type',
		name: 'sampleDataType',
		type: 'options',
		default: 'feedback-events',
		displayOptions: { show: { resource: ['webhook'], operation: ['getSampleData'] } },
		required: true,
		description: 'Type of sample data to retrieve',
		options: [
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
		],
	},

	// ====== Optionen pro Event (identisch zu instantProperties) ======

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
				description:
					'Filter by login type. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				options: [
					{ name: 'All', value: '' },
					{ name: 'App Email Code', value: 'app-email-code' },
					{ name: 'Auto Login', value: 'auto-login' },
					{ name: 'Email & Password', value: 'email-password' },
					{ name: 'Google', value: 'google' },
					{ name: 'Impersonated by Admin', value: 'impersonated-by-admin' },
					{ name: 'Impersonation (as Member)', value: 'impersonation' },
					{ name: 'Magic Link', value: 'magic-link' },
					{ name: 'OIDC', value: 'oidc' },
					{ name: 'Password Reset', value: 'password-reset' },
					{ name: 'Refresh', value: 'refresh' },
				],
			},
			{
				displayName: 'User Role Name or ID',
				name: 'userRoleId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'role_getRoles' },
				default: '',
				description:
					'Optional role filter. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
				typeOptions: { loadOptionsMethod: 'community_getAreas' },
				default: '',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Forum Name or ID',
				name: 'forumId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'community_getForums',
					loadOptionsDependsOn: ['additionalCommunityPostCreated.areaId'],
				},
				default: '',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
				typeOptions: { loadOptionsMethod: 'community_getAreas' },
				default: '',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Forum Name or ID',
				name: 'forumId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'community_getForums',
					loadOptionsDependsOn: ['additionalCommunityPostCommented.areaId'],
				},
				default: '',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Mentioned User Names or IDs',
				name: 'mentionedUserIds',
				type: 'multiOptions',
				typeOptions: { loadOptionsMethod: 'member_getMembers' },
				default: [],
				description:
					'Only deliver comments that mention at least one of these users. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
				typeOptions: { loadOptionsMethod: 'community_getAreas' },
				default: '',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Forum Name or ID',
				name: 'forumId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'community_getForums',
					loadOptionsDependsOn: ['additionalCommunityPostModerated.areaId'],
				},
				default: '',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
		],
	},

	// Feedback (nur courseInstanceId)
	{
		displayName: 'Feedback Options',
		name: 'additionalFeedbackOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createSubscription', 'updateSubscription'],
				eventType: ['feedback.created'],
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

	// Exam (courseInstanceId + examModuleId)
	{
		displayName: 'Exam Options',
		name: 'additionalExamOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createSubscription', 'updateSubscription'],
				eventType: ['exam.completed', 'exam.graded'],
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
			{
				displayName: 'Exam Module Name or ID',
				name: 'examModuleId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'module_getModules',
					loadOptionsDependsOn: ['additionalExamOptions.courseId'],
				},
				default: '',
				description:
					'Optional module filter. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// Access Request Course (required)
	{
		displayName: 'Course Name or ID',
		name: 'courseId',
		type: 'options',
		required: true,
		typeOptions: { loadOptionsMethod: 'course_getCourses' },
		default: '',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
				typeOptions: { loadOptionsMethod: 'group_getGroups' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
		],
	},

	// Lesson Completed (kaskadiert)
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
				typeOptions: { loadOptionsMethod: 'course_getCourses' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Module Name or ID',
				name: 'moduleId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'course_getModules',
					loadOptionsDependsOn: ['additionalLessonCompleted.courseId'],
				},
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Lesson Name or ID',
				name: 'lessonId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'module_getLessons',
					loadOptionsDependsOn: ['additionalLessonCompleted.moduleId'],
				},
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
		],
	},

	// Submission Created (optional course)
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
				typeOptions: { loadOptionsMethod: 'course_getCourses' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
		],
	},
];
