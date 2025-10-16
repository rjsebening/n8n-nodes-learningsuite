import type { INodeProperties } from 'n8n-workflow';

export const instantProperties: INodeProperties[] = [
	// Event-Auswahl (nur Instant)
	{
		displayName: 'Event',
		name: 'event',
		type: 'options',
		default: 'communityPost.created',
		description: 'Select the LearningSuite instant (webhook) event',
		options: [
			{
				name: 'Community Post Commented',
				value: 'communityPost.commented',
				description: 'Triggers when a community post was commented',
			},
			{
				name: 'Community Post Created',
				value: 'communityPost.created',
				description: 'Triggers when a new community post is created',
			},
			{
				name: 'Community Post Moderated',
				value: 'communityPost.moderated',
				description: 'Triggers when a community post was moderated (accepted or rejected)',
			},
			{
				name: 'Course Progress Changed',
				value: 'courseProgress.changed',
				description: 'Triggers when the course progress of a member crosses a given threshold',
			},
			{
				name: 'Custom Popup Interaction',
				value: 'customPopup.interaction',
				description: 'Triggers when a member interacts with a custom popup',
			},
			{ name: 'Exam Completed', value: 'exam.completed', description: 'Triggers when a member finishes an exam' },
			{
				name: 'Exam Graded',
				value: 'exam.graded',
				description: 'Triggers when an exam is graded (manually or automatically)',
			},
			{
				name: 'Group User Access Changed',
				value: 'group.userAccessChanged',
				description: 'Triggers when a member is added to or removed from a group',
			},
			{
				name: 'Lesson Completed',
				value: 'lesson.completed',
				description: 'Triggers when a lesson has been completed by a member',
			},
			{
				name: 'New Access Request',
				value: 'accessRequest.created',
				description: 'Triggers when a user requests access to a module in the course',
			},
			{
				name: 'New Feedback Created',
				value: 'feedback.created',
				description: 'Triggers when a user submits new feedback',
			},
			{ name: 'New Login', value: 'login.new', description: 'Triggers when a member logs in' },
			{
				name: 'Submission Created',
				value: 'submission.created',
				description: 'Triggers when a member submits an interactive task (file, audio, video, text)',
			},
		],
	},

	// --------- Per-Event Options (eindeutige Collections) ----------

	// Login (optional filter)
	{
		displayName: 'Login Options',
		name: 'additionalLoginNew',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['login.new'] } },
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
		displayOptions: { show: { event: ['customPopup.interaction'] } },
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
		displayOptions: { show: { event: ['courseProgress.changed'] } },
	},
	{
		displayName: 'Course Progress Options',
		name: 'additionalCourseProgress',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['courseProgress.changed'] } },
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
		displayOptions: { show: { event: ['communityPost.created'] } },
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
		displayOptions: { show: { event: ['communityPost.commented'] } },
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
		displayOptions: { show: { event: ['communityPost.moderated'] } },
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
		displayOptions: { show: { event: ['feedback.created', 'exam.completed', 'exam.graded'] } },
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

	// Access Request Course

	{
		displayName: 'Course Name or ID',
		name: 'courseId',
		type: 'options',
		required: true,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: { loadOptionsMethod: 'course_getCourses' },
		default: '',
		displayOptions: { show: { event: ['accessRequest.created'] } },
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
		displayOptions: { show: { event: ['group.userAccessChanged'] } },
	},
	{
		displayName: 'Group Access Options',
		name: 'additionalGroupAccess',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['group.userAccessChanged'] } },
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

	// Lesson Completed (kaskadierende LoadOptions)
	{
		displayName: 'Lesson Completed Options',
		name: 'additionalLessonCompleted',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['lesson.completed'] } },
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

	// Submission Created (optional course)
	{
		displayName: 'Submission Options',
		name: 'additionalSubmission',
		type: 'collection',
		default: {},
		placeholder: 'Add option',
		displayOptions: { show: { event: ['submission.created'] } },
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
