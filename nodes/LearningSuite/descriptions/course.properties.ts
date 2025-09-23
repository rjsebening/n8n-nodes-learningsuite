import type { INodeProperties } from 'n8n-workflow';

export const courseProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'getPublished',
		displayOptions: { show: { resource: ['course'] } },
		options: [
			{
				name: 'Create Lesson',
				value: 'createLesson',
				description: 'Create a lesson in a course section (optional page content)',
				action: 'Create lesson',
			},
			{
				name: 'Get Course Access Requests',
				value: 'getAccessRequests',
				description: 'List access requests for a course',
				action: 'Get course access requests',
			},
			{
				name: 'Get Course Members',
				value: 'getMembers',
				description: 'List members of a course with access information (and optional progress)',
				action: 'Get course members',
			},
			{
				name: 'Get Course Modules',
				value: 'getModules',
				description: 'List modules for a course',
				action: 'Get course modules',
			},
			{
				name: 'Get Course Modules for Member',
				value: 'getModulesForMember',
				description: 'List course modules with member-specific drip access information',
				action: 'Get course modules for member',
			},

			{
				name: 'Get Course Submissions',
				value: 'getSubmissions',
				description: 'List submissions in a course (newest first)',
				action: 'Get course submissions',
			},
			{
				name: 'Get Published Courses',
				value: 'getPublished',
				description: 'List published courses',
				action: 'Get published courses',
			},
		],
	},
	{
		displayName: 'Course Name or ID',
		name: 'courseId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'course_getCourses' },
		displayOptions: {
			show: {
				resource: ['course'],
				operation: [
					'getModules',
					'getModulesForMember',
					'getMembers',
					'getAccessRequests',
					'getSubmissions',
					'createLesson',
				],
			},
		},
		default: '',
		required: true,
		description:
			'ID of the course. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Module Name or ID',
		name: 'moduleId',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['course'],
				operation: ['createLesson'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'course_getModules',
			loadOptionsDependsOn: ['courseId'],
		},
		default: '',
		required: true,
		description:
			'Select a module. Optionally, select a course first to filter the list. Or enter an ID using an expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Section Name or ID',
		name: 'sectionId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'module_getSections',
			loadOptionsDependsOn: ['moduleId'],
		},
		displayOptions: {
			show: {
				resource: ['course'],
				operation: ['createLesson'],
			},
		},
		default: '',
		required: true,
	},
	/*{
		displayName: 'Section Name or ID',
		name: 'sectionId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'course_getSectionsInCourse',
			loadOptionsDependsOn: ['courseId'],
		},
		displayOptions: {
			show: {
				resource: ['course'],
				operation: ['createUnlockOverride', 'createLesson'],
			},
		},
		default: '',
		required: true,
	},*/
	{
		displayName: 'Member Name or ID',
		name: 'memberId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'member_getMembers' },
		displayOptions: { show: { resource: ['course'], operation: ['getModulesForMember'] } },
		default: '',
		required: true,
		description:
			'Member for whom to load modules. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	{
		displayName: 'Lesson Name',
		name: 'lessonName',
		type: 'string',
		displayOptions: { show: { resource: ['course'], operation: ['createLesson'] } },
		default: '',
		required: true,
		description: 'Name of the lesson',
	},
	{
		displayName: 'Lesson Sort Position',
		name: 'lessonSortPosition',
		type: 'options',
		options: [
			{ name: 'First', value: 'first' },
			{ name: 'Last', value: 'last' },
		],
		default: 'last',
		description: 'Place the new lesson at the beginning or end of the section',
		displayOptions: { show: { resource: ['course'], operation: ['createLesson'] } },
	},
	{
		displayName: 'Immediately Publish Course',
		name: 'immediatelyPublishCourse',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['course'], operation: ['createLesson'] } },
		description:
			'Whether the course should be published immediately after the lesson and page are created. Warning: this will also publish any changes since the last release of a new course version.',
	},
	{
		displayName:
			'<b>If you enable "Immediately Publish Course":</b>Publishing the course will go live immediately and will include ALL changes since the last published version. <br><br> Ensure that the content and settings are final.',
		name: 'notice_immediatelyPublishCourse',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['course'], operation: ['createLesson'] } },
	},
	
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['course'], operation: ['createLesson'] } },
		options: [
			{
				displayName: 'HTML Content',
				name: 'htmlContent',
				type: 'string',
				default: '',
				description:
					'HTML content will be parsed to LearningSuite content and inserted into the Page of the created Lesson. The content will be inserted after the video if a video URL is provided. Only formatted text and images can be inserted.',
			},
			{
				displayName: 'Lesson Description',
				name: 'lessonDescription',
				type: 'string',
				default: '',
				description: 'Description of the lesson',
			},
			{
				displayName: 'Thumbnail Timestamp (Sec)',
				name: 'timestampInSecondsToGenerateThumbnail',
				type: 'number',
				default: '',
				description:
					'Second mark of the video to capture the thumbnail from. Only relevant if a Video URL is provided.',
			},
			{
				displayName: 'Thumbnail URL',
				name: 'thumbnailUrl',
				type: 'string',
				default: '',
				description: 'A direct-downloadable image URL to be set as lesson and video thumbnail (no auth headers)',
			},

			{
				displayName: 'Video URL',
				name: 'videoUrl',
				type: 'string',
				default: '',
				description:
					'A direct-downloadable video URL to be inserted as the first element on the lesson page. If no explicit thumbnail is set, the first frame of the video will be used as thumbnail.',
			},
		],
	},
];
