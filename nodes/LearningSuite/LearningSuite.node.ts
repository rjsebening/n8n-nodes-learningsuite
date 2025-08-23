import {
	ICredentialTestFunctions,
	ICredentialsDecrypted,
	ICredentialDataDecryptedObject,
	INodeCredentialTestResult,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

export class LearningSuite implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LearningSuite',
		name: 'learningSuite',
		icon: 'fa:book',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with LearningSuite API',
		defaults: {
			name: 'LearningSuite',
			// @ts-expect-error -- description is required by nodelinter but missing in type definition
			description: 'Interact with LearningSuite API',
		},
		inputs: [NodeConnectionType.Main],
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
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'API Call',
						value: 'apiCall',
						description: 'API Call LearningSuite API',
					},
					{
						name: 'Bundle',
						value: 'bundle',
						description: 'Bundle LearningSuite API',
					},
					{
						name: 'Community',
						value: 'community',
						description: 'Communtiy LearningSuite API',
					},
					{
						name: 'Course',
						value: 'course',
						description: 'Course LearningSuite API',
					},
					{
						name: 'Group',
						value: 'group',
						description: 'Group LearningSuite API',
					},
					{
						name: 'Hub',
						value: 'hub',
						description: 'Hub LearningSuite API',
					},
					{
						name: 'Member',
						value: 'member',
						description: 'Member LearningSuite API',
					},
					{
						name: 'Module',
						value: 'module',
						description: 'Moudle LearningSuite API',
					},

					{
						name: 'Popup',
						value: 'popup',
						description: 'Popup LearningSuite API',
					},
					{
						name: 'Role',
						value: 'role',
						description: 'Role LearningSuite API',
					},
					{
						name: 'Webhook',
						value: 'webhook',
						description: 'Webhook LearningSuite API',
					},
				],
				default: 'member',
			},

			// Member Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'getByEmail',				
				displayOptions: {
					show: {
						resource: ['member'],
					},
				},
				options: [
					{
						name: 'Activate or Deactivate',
						value: 'activateDeactivate',
						description: 'Activate or deactivate a member',
						action: 'Activate/deactivate member',
					},
					{
						name: 'Add to Bundles',
						value: 'addToBundles',
						description: 'Add member to bundles',
						action: 'Add member to bundles',
					},
					{
						name: 'Add to Courses',
						value: 'addToCourses',
						description: 'Add member to courses',
						action: 'Add member to courses',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new member',
						action: 'Create a member',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a member',
						action: 'Delete a member',
					},
					{
						name: 'Find or Create',
						value: 'findOrCreate',
						description: 'Find member by email or create if not found',
						action: 'Find or create member',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all members',
						action: 'Get all members',
					},
					{
						name: 'Get Bundles',
						value: 'getBundles',
						description: 'Get all bundles for a member',
						action: 'Get member bundles',
					},
					{
						name: 'Get Course Info',
						value: 'getCourseInfo',
						description: 'Get member course access and progress info',
						action: 'Get member course info',
					},
					{
						name: 'Get Courses',
						value: 'getCourses',
						description: 'Get all courses for a member',
						action: 'Get member courses',
					},
					{
						name: 'Get by Email',
						value: 'getByEmail',
						description: 'Get a member by email address',
						action: 'Get member by email',
					},
					{
						name: 'Get by ID',
						value: 'getById',
						description: 'Get a member by ID',
						action: 'Get member by ID',
					},
					{
						name: 'Remove From Bundles',
						value: 'removeFromBundles',
						description: 'Remove member from bundles',
						action: 'Remove member from bundles',
					},
					{
						name: 'Remove From Courses',
						value: 'removeFromCourses',
						description: 'Remove member from courses',
						action: 'Remove member from courses',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a member',
						action: 'Update a member',
					},
				],
			},

			// Course Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'getPublished',
				displayOptions: {
					show: {
						resource: ['course'],
					},
				},
				options: [
					{
						name: 'Create Lesson',
						value: 'createLesson',
						description: 'Create a lesson in a course section',
						action: 'Create lesson',
					},
					{
						name: 'Get Access Requests',
						value: 'getAccessRequests',
						description: 'Get access requests for a course',
						action: 'Get course access requests',
					},
					{
						name: 'Get Members',
						value: 'getMembers',
						description: 'Get members of a course',
						action: 'Get course members',
					},
					{
						name: 'Get Modules',
						value: 'getModules',
						description: 'Get modules for a course',
						action: 'Get course modules',
					},
					{
						name: 'Get Modules for Member',
						value: 'getModulesForMember',
						description: 'Get modules for a course with member-specific access info',
						action: 'Get course modules for member',
					},
					{
						name: 'Get Published',
						value: 'getPublished',
						description: 'Get all published courses',
						action: 'Get published courses',
					},
					{
						name: 'Get Submissions',
						value: 'getSubmissions',
						description: 'Get submissions for a course',
						action: 'Get course submissions',
					},
				],
			},

			// Group Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'findOrCreate',
				displayOptions: {
					show: {
						resource: ['group'],
					},
				},
				options: [
					{
						name: 'Add Bundles',
						value: 'addBundles',
						description: 'Add bundles to group',
						action: 'Add bundles to group',
					},
					{
						name: 'Add Courses',
						value: 'addCourses',
						description: 'Add courses to group',
						action: 'Add courses to group',
					},
					{
						name: 'Add Members',
						value: 'addMembers',
						description: 'Add members to groups',
						action: 'Add members to groups',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new group',
						action: 'Create a group',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a group',
						action: 'Delete a group',
					},
					{
						name: 'Find by Name',
						value: 'findByName',
						description: 'Find groups by name',
						action: 'Find groups by name',
					},
					{
						name: 'Find or Create',
						value: 'findOrCreate',
						description: 'Find group by name or create if not found',
						action: 'Find or create group',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all groups',
						action: 'Get all groups',
					},
					{
						name: 'Get Courses',
						value: 'getCourses',
						description: 'Get courses of a group',
						action: 'Get group courses',
					},
					{
						name: 'Remove Courses',
						value: 'removeCourses',
						description: 'Remove courses from group',
						action: 'Remove courses from group',
					},
					{
						name: 'Remove Members',
						value: 'removeMembers',
						description: 'Remove members from groups',
						action: 'Remove members from groups',
					},
				],
			},

			// Bundle Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'getAll',
				displayOptions: {
					show: {
						resource: ['bundle'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all bundles',
						action: 'Get all bundles',
					},
					{
						name: 'Get Members',
						value: 'getMembers',
						description: 'Get members of a bundle',
						action: 'Get bundle members',
					},
				],
			},
			// Role Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'getAll',
				displayOptions: {
					show: {
						resource: ['role'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all user roles',
						action: 'Get all roles',
					},
				],
			},

			// API Call Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'makeRequest',
				displayOptions: {
					show: {
						resource: ['apiCall'],
					},
				},
				options: [
					{
						name: 'Make Request',
						value: 'makeRequest',
						description: 'Make an arbitrary API call',
						action: 'Make API call',
					},
				],
			},

			// Hub Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'getAll',
				displayOptions: {
					show: {
						resource: ['hub'],
					},
				},
				options: [
					{
						name: 'Add Access',
						value: 'addAccess',
						description: 'Add hub access for members/groups/bundles',
						action: 'Add hub access',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new hub',
						action: 'Create a hub',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all published hubs',
						action: 'Get all hubs',
					},
					{
						name: 'Get Templates',
						value: 'getTemplates',
						description: 'Get hub templates',
						action: 'Get hub templates',
					},
					{
						name: 'Remove Access',
						value: 'removeAccess',
						description: 'Remove hub access',
						action: 'Remove hub access',
					},
				],
			},

			// Module Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'getLessons',
				displayOptions: {
					show: {
						resource: ['module'],
					},
				},
				options: [
					{
						name: 'Create Unlock Override',
						value: 'createUnlockOverride',
						description: 'Create module unlock override',
						action: 'Create unlock override',
					},
					{
						name: 'Get Lessons',
						value: 'getLessons',
						description: 'Get lessons for a module',
						action: 'Get module lessons',
					},
					{
						name: 'Get Sections',
						value: 'getSections',
						description: 'Get sections for a module',
						action: 'Get module sections',
					},
				],
			},

			// Community Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'getAreas',
				displayOptions: {
					show: {
						resource: ['community'],
					},
				},
				options: [
					{
						name: 'Get Areas',
						value: 'getAreas',
						description: 'Get community areas',
						action: 'Get community areas',
					},
					{
						name: 'Get Forums',
						value: 'getForums',
						description: 'Get community forums',
						action: 'Get community forums',
					},
				],
			},

			// Popup Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'getAll',
				displayOptions: {
					show: {
						resource: ['popup'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all popups',
						action: 'Get all popups',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a specific popup',
						action: 'Get a popup',
					},
					{
						name: 'Remove Trigger for Member',
						value: 'removeTriggerForMember',
						description: 'Remove popup trigger for a member',
						action: 'Remove popup trigger for member',
					},
					{
						name: 'Trigger for Member',
						value: 'triggerForMember',
						description: 'Trigger a popup for a member',
						action: 'Trigger popup for member',
					},
				],
			},

			// Webhook Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'getSubscriptions',
				displayOptions: {
					show: {
						resource: ['webhook'],
					},
				},
				options: [
					{
						name: 'Create Subscription',
						value: 'createSubscription',
						description: 'Create a new webhook subscription',
						action: 'Create webhook subscription',
					},
					{
						name: 'Delete Subscription',
						value: 'deleteSubscription',
						description: 'Delete a webhook subscription',
						action: 'Delete webhook subscription',
					},
					{
						name: 'Get All Subscriptions',
						value: 'getSubscriptions',
						description: 'Get all webhook subscriptions',
						action: 'Get webhook subscriptions',
					},
					{
						name: 'Get Sample Data',
						value: 'getSampleData',
						description: 'Get sample data for webhook events',
						action: 'Get webhook sample data',
					},
					{
						name: 'Get Subscription',
						value: 'getSubscription',
						description: 'Get a specific webhook subscription',
						action: 'Get webhook subscription',
					},
					{
						name: 'Update Subscription',
						value: 'updateSubscription',
						description: 'Update a webhook subscription',
						action: 'Update webhook subscription',
					},
				],
			},

			// Common ID fields
			{
				displayName: 'Member ID',
				name: 'memberId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['member', 'course', 'popup'],
						operation: ['getById', 'update', 'delete', 'activateDeactivate', 'addToCourses', 'removeFromCourses', 'getCourses', 'getCourseInfo', 'addToBundles', 'removeFromBundles', 'getBundles', 'getModulesForMember', 'triggerForMember', 'removeTriggerForMember'],
					},
				},
				default: '',
				required: true,
				description: 'ID of the member',
			},

			{
				displayName: 'Course ID',
				name: 'courseId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['course', 'member'],
						operation: ['getModules', 'getModulesForMember', 'getMembers', 'getAccessRequests', 'getSubmissions', 'createLesson', 'getCourseInfo'],
					},
				},
				default: '',
				required: true,
				description: 'ID of the course',
			},

			{
				displayName: 'Bundle ID',
				name: 'bundleId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['bundle'],
						operation: ['getMembers'],
					},
				},
				default: '',
				required: true,
				description: 'ID of the bundle',
			},

			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['delete', 'getCourses', 'addCourses', 'removeCourses', 'addBundles'],
					},
				},
				default: '',
				required: true,
				description: 'ID of the group',
			},

			// API Call fields
			{
				displayName: 'HTTP Method',
				name: 'httpMethod',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['apiCall'],
						operation: ['makeRequest'],
					},
				},
				options: [
					{
						name: 'DELETE',
						value: 'DELETE',
					},
					{
						name: 'GET',
						value: 'GET',
					},
					{
						name: 'PATCH',
						value: 'PATCH',
					},
					{
						name: 'POST',
						value: 'POST',
					},
					{
						name: 'PUT',
						value: 'PUT',
					},
				],
				default: 'GET',
				required: true,
				description: 'HTTP method for the API call',
			},

			{
				displayName: 'Endpoint',
				name: 'endpoint',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['apiCall'],
						operation: ['makeRequest'],
					},
				},
				default: '',
				required: true,
				placeholder: '/members/123/courses',
				description: 'API endpoint path (without base URL)',
			},

			{
				displayName: 'Request Body',
				name: 'requestBody',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['apiCall'],
						operation: ['makeRequest'],
						httpMethod: ['POST', 'PUT', 'PATCH'],
					},
				},
				default: '{}',
				description: 'Request body as JSON',
			},

			{
				displayName: 'Query Parameters',
				name: 'queryParameters',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['apiCall'],
						operation: ['makeRequest'],
					},
				},
				default: {},
				options: [
					{
						name: 'parameter',
						displayName: 'Parameter',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Name of the query parameter',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value of the query parameter',
							},
						],
					},
				],
			},

			// Activate/Deactivate field
			{
				displayName: 'Action',
				name: 'activateAction',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['activateDeactivate'],
					},
				},
				options: [
					{
						name: 'Activate',
						value: 'activate',
					},
					{
						name: 'Deactivate',
						value: 'deactivate',
					},
				],
				default: 'activate',
				required: true,
				description: 'Whether to activate or deactivate the member',
			},

			// Include Groups option
			{
				displayName: 'Include Groups',
				name: 'includeGroups',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['getById'],
					},
				},
				default: false,
				description: 'Whether to include group information in the response',
			},

			{
				displayName: 'Module ID',
				name: 'moduleId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['module'],
						operation: ['getLessons', 'getSections', 'createUnlockOverride'],
					},
				},
				default: '',
				required: true,
				description: 'ID of the module',
			},

			{
				displayName: 'Hub ID',
				name: 'hubId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['hub'],
						operation: ['addAccess', 'removeAccess'],
					},
				},
				default: '',
				required: true,
				description: 'ID of the hub',
			},

			{
				displayName: 'Popup ID',
				name: 'popupId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['popup'],
						operation: ['get', 'triggerForMember', 'removeTriggerForMember'],
					},
				},
				default: '',
				required: true,
				description: 'ID or SID of the popup',
			},

			{
				displayName: 'Subscription ID',
				name: 'subscriptionId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['webhook'],
						operation: ['getSubscription', 'updateSubscription', 'deleteSubscription'],
					},
				},
				default: '',
				required: true,
				description: 'ID of the webhook subscription',
			},

			{
				displayName: 'Area ID',
				name: 'areaId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['community'],
						operation: ['getForums'],
					},
				},
				default: '',
				description: 'ID of the community area to filter forums',
			},

			// Email field for getByEmail operation
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'user@example.com',
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['getByEmail', 'findOrCreate'],
					},
				},
				default: '',
				required: true,
				description: 'Email address of the member to retrieve',
			},

			// Member creation/update fields
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['create', 'update', 'findOrCreate'],
					},
				},
				default: '',
				description: 'First name of the member',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['create', 'update', 'findOrCreate'],
					},
				},
				default: '',
				description: 'Last name of the member',
			},
			{
				displayName: 'Email',
				name: 'memberEmail',
				type: 'string',
				placeholder: 'user@example.com',
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'Email address of the member',
			},

			// Course IDs for member operations
			{
				displayName: 'Course IDs',
				name: 'courseIds',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['member', 'group'],
						operation: ['addToCourses', 'removeFromCourses', 'addCourses', 'removeCourses'],
					},
				},
				default: '',
				placeholder: 'id1,id2,id3',
				description: 'Comma-separated list of course IDs',
			},

			// Bundle IDs
			{
				displayName: 'Bundle IDs',
				name: 'bundleIds',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['member', 'group', 'hub'],
						operation: ['addToBundles', 'removeFromBundles', 'addBundles', 'addAccess', 'removeAccess'],
					},
				},
				default: '',
				placeholder: 'id1,id2,id3',
				description: 'Comma-separated list of bundle IDs',
			},

			// Group operations
			{
				displayName: 'Group Name',
				name: 'groupName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['create', 'findByName', 'findOrCreate'],
					},
				},
				default: '',
				required: true,
				description: 'Name of the group',
			},

			{
				displayName: 'User IDs',
				name: 'userIds',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['addMembers', 'removeMembers'],
					},
				},
				default: '',
				placeholder: 'id1,id2,id3',
				description: 'Comma-separated list of user IDs',
			},

			{
				displayName: 'Group IDs',
				name: 'groupIds',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['group', 'hub'],
						operation: ['addMembers', 'removeMembers', 'addAccess', 'removeAccess'],
					},
				},
				default: '',
				placeholder: 'id1,id2,id3',
				description: 'Comma-separated list of group IDs',
			},

			// Hub creation fields
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['hub'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'ID of the hub template',
			},

			{
				displayName: 'Hub Name',
				name: 'hubName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['hub'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'Name of the hub',
			},

			{
				displayName: 'Member IDs',
				name: 'memberIds',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['hub'],
						operation: ['addAccess', 'removeAccess'],
					},
				},
				default: '',
				placeholder: 'id1,id2,id3',
				description: 'Comma-separated list of member IDs',
			},

			// Lesson creation fields
			{
				displayName: 'Section ID',
				name: 'sectionId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['course'],
						operation: ['createLesson'],
					},
				},
				default: '',
				required: true,
				description: 'ID of the section to create lesson in',
			},

			{
				displayName: 'Lesson Name',
				name: 'lessonName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['course'],
						operation: ['createLesson'],
					},
				},
				default: '',
				required: true,
				description: 'Name of the lesson',
			},

			// Webhook fields
			{
				displayName: 'Hook URL',
				name: 'hookUrl',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['webhook'],
						operation: ['createSubscription', 'updateSubscription'],
					},
				},
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
			default: 'new.login',
			displayOptions: {
				show: {
				resource: ['webhook'],
				operation: ['createSubscription', 'updateSubscription'],
				},
			},
			options: [
				{ name: 'Community Post Created', value: 'communityPost.created' },
				{ name: 'Community Post Moderated', value: 'communityPost.moderated' },
				{ name: 'Custom Popup Interaction', value: 'custom.popup.interaction' },
				{ name: 'Exam Completed', value: 'exam.completed' },
				{ name: 'Exam Graded', value: 'exam.graded' },
				{ name: 'Feedback Created', value: 'feedback.created' },
				{ name: 'Group User Access Changed', value: 'group.userAccessChanged' },
				{ name: 'Lesson Completed', value: 'lesson.completed' },
				{ name: 'New Login', value: 'new.login' },
				{ name: 'Progress Changed', value: 'progress.changed' },
			],
			description: 'Type of event to subscribe to',
			},
			{
			displayName: 'Sample Data Type',
			name: 'sampleDataType',
			type: 'options',
			default: 'feedback-events',
			displayOptions: {
				show: {
				resource: ['webhook'],
				operation: ['getSampleData'],
				},
				},
				options: [
					{
						name: 'Community Post Created Events',
						value: 'community-post-created-events',
					},
					{
						name: 'Community Post Moderated Events',
						value: 'community-post-moderated-events',
					},
					{
						name: 'Custom Popup Interaction Events',
						value: 'custom-popup-interaction-events',
					},
					{
						name: 'Exam Completed Events',
						value: 'exam-completed-events',
					},
					{
						name: 'Exam Graded Events',
						value: 'exam-graded-events',
					},
					{
						name: 'Feedback Events',
						value: 'feedback-events',
					},
					{
						name: 'Group User Access Changed Events',
						value: 'group-user-access-changed-events',
					},
					{
						name: 'Lesson Completed Events',
						value: 'lesson-completed-events',
					},
					{
						name: 'New Login Events',
						value: 'new-login-events',
					},
					{
						name: 'Progress Changed Events',
						value: 'progress-changed-events',
					},
				],
			required: true,
			description: 'Type of sample data to retrieve',
			},

			// Pagination options
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				description: 'Max number of results to return',
				displayOptions: {
					show: {
						resource: ['community', 'popup'],
						operation: ['getAreas', 'getForums', 'getAll'],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
				},
				default: 50,
			},

			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['community', 'popup'],
						operation: ['getAreas', 'getForums', 'getAll'],
					},
				},
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Number of results to skip for pagination',
			},
			// Additional Options (nur für getAll)
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Days Not Logged In (>=)',
						name: 'daysNotLoggedInGte',
						type: 'number',
						default: 7,
						description: 'Filter members by days not logged in (greater than or equal)',
					},
					{
						displayName: 'Include Never Logged In',
						name: 'includeNeverLoggedIn',
						type: 'boolean',
						default: false,
						description: 'Whether to include users who never logged in',
					},
				],
			},

			// Update Fields (für update)
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'About',
						name: 'about',
						type: 'string',
						default: '',
						description: 'About text for the member',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
						description: 'City of the member',
					},
					{
						displayName: 'Enabled',
						name: 'enabled',
						type: 'boolean',
						default: true,
						description: 'Whether the member account is enabled',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
						description: 'Phone number of the member',
					},
					{
						displayName: 'Position',
						name: 'position',
						type: 'string',
						default: '',
						description: 'Position/job title of the member',
					},
				],
			},

			// Additional Options (für create & findOrCreate)
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['create', 'findOrCreate'],
					},
				},
			options: [
				{
					displayName: 'About',
					name: 'about',
					type: 'string',
					default: '',
					description: 'About text for the member',
				},
				{
					displayName: 'City',
					name: 'city',
					type: 'string',
					default: '',
					description: 'City of the member',
				},
				{
					displayName: 'Enabled',
					name: 'enabled',
					type: 'boolean',
					default: true,
					description: 'Whether the member account is enabled',
				},
				{
					displayName: 'Phone',
					name: 'phone',
					type: 'string',
					default: '',
					description: 'Phone number of the member',
				},
				{
					displayName: 'Position',
					name: 'position',
					type: 'string',
					default: '',
					description: 'Position/job title of the member',
				},
			],
			},


			// Additional options for groups
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['getAll', 'findByName', 'findOrCreate'],
					},
				},
				options: [
					{
						displayName: 'Include Users',
						name: 'includeUsers',
						type: 'boolean',
						default: false,
						description: 'Whether: Include users in group results',
					},
				],
			},

			// Additional options for lesson creation
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['course'],
						operation: ['createLesson'],
					},
				},
				options: [
					{
						displayName: 'Lesson Description',
						name: 'lessonDescription',
						type: 'string',
						default: '',
						description: 'Description of the lesson',
					},
					{
						displayName: 'HTML Content',
						name: 'htmlContent',
						type: 'string',
						default: '',
						description: 'HTML content for the lesson',
					},
					{
						displayName: 'Video URL',
						name: 'videoUrl',
						type: 'string',
						default: '',
						description: 'Video URL for the lesson',
					},
					{
						displayName: 'Immediately Publish Course',
						name: 'immediatelyPublishCourse',
						type: 'boolean',
						default: false,
						description: 'Whether: Automatically publish course after creating lesson',
					},
				],
			},

			// Additional options for hub creation
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['hub'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Hub Description',
						name: 'hubDescription',
						type: 'string',
						default: '',
						description: 'Description of the hub',
					},
					{
						displayName: 'Publish Hub',
						name: 'publishHub',
						type: 'boolean',
						default: false,
						description: 'Whether: Publish the hub immediately',
					},
				],
			},

			// Additional options for webhook subscriptions
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['webhook'],
						operation: ['createSubscription', 'updateSubscription'],
					},
				},
				options: [
					{
						displayName: 'Course Instance ID',
						name: 'courseInstanceId',
						type: 'string',
						default: '',
						description: 'Filter events by course instance ID',
					},
				],
			},
		],
	};

		methods = {
		credentialTest: {
			async learningSuiteApiTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted<ICredentialDataDecryptedObject>,
			): Promise<INodeCredentialTestResult> {
				const baseUrl = credential.data?.baseUrl as string;
				const apiKey = credential.data?.apiKey as string;

				if (!baseUrl || !apiKey) {
					return {
						status: 'Error',
						message: 'Missing credentials',
					};
				}

				try {
					const response = await this.helpers.request({
						method: 'GET',
						url: `${baseUrl}/auth`,
						headers: {
							'X-API-KEY': apiKey,
						},
					});

					if (response) {
						return {
							status: 'OK',
							message: 'Authentication successful!',
						};
					}

					return {
						status: 'Error',
						message: 'No response from API',
					};
				} catch (error) {
					return {
						status: 'Error',
						message: `Credential test failed: ${(error as Error).message}`,
					};
				}
			},
		},
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		let responseData;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'member') {
					if (operation === 'getByEmail') {
						const email = this.getNodeParameter('email', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: '/members/by-email',
								qs: { email },
							},
						);
					}

					if (operation === 'getById') {
						const memberId = this.getNodeParameter('memberId', i) as string;
						const includeGroups = this.getNodeParameter('includeGroups', i) as boolean;

						const qs: IDataObject = {};
						if (includeGroups) {
							qs.includeGroups = includeGroups;
						}

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: `/members/${memberId}`,
								qs,
							},
						);
					}

					if (operation === 'getAll') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;
						const qs: IDataObject = {};

						if (additionalOptions.daysNotLoggedInGte) {
							qs.days_not_logged_in_gte = additionalOptions.daysNotLoggedInGte;
						}
						if (additionalOptions.includeNeverLoggedIn) {
							qs.include_never_logged_in = additionalOptions.includeNeverLoggedIn;
						}

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: '/members',
								qs,
							},
						);
					}

					if (operation === 'create') {
						const email = this.getNodeParameter('memberEmail', i) as string;
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;

						const body: IDataObject = { email, firstName, lastName };

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'POST',
								url: '/members',
								body,
							},
						);
					}

					if (operation === 'update') {
						const memberId = this.getNodeParameter('memberId', i) as string;
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const body: IDataObject = {
							firstName,
							lastName,
							...additionalOptions,
						};

						// Remove empty values
						Object.keys(body).forEach(key => {
							if (body[key] === '' || body[key] === null || body[key] === undefined) {
								delete body[key];
							}
						});

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'PUT',
								url: `/members/${memberId}`,
								body,
							},
						);
					}

					if (operation === 'delete') {
						const memberId = this.getNodeParameter('memberId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'DELETE',
								url: `/members/${memberId}`,
							},
						);
					}

					if (operation === 'activateDeactivate') {
						const memberId = this.getNodeParameter('memberId', i) as string;
						const activateAction = this.getNodeParameter('activateAction', i) as string;

						const body: IDataObject = {
							enabled: activateAction === 'activate',
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'PUT',
								url: `/members/${memberId}`,
								body,
							},
						);
					}

					if (operation === 'addToCourses') {
						const memberId = this.getNodeParameter('memberId', i) as string;
						const courseIds = (this.getNodeParameter('courseIds', i) as string).split(',').map(id => id.trim());

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'PUT',
								url: `/members/${memberId}/courses`,
								body: { courseIds },
							},
						);
					}

					if (operation === 'removeFromCourses') {
						const memberId = this.getNodeParameter('memberId', i) as string;
						const courseIds = (this.getNodeParameter('courseIds', i) as string).split(',').map(id => id.trim());

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'DELETE',
								url: `/members/${memberId}/courses`,
								body: { courseIds },
							},
						);
					}

					if (operation === 'getCourses') {
						const memberId = this.getNodeParameter('memberId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: `/members/${memberId}/courses`,
							},
						);
					}

					if (operation === 'getCourseInfo') {
						const memberId = this.getNodeParameter('memberId', i) as string;
						const courseId = this.getNodeParameter('courseId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: `/members/${memberId}/course-info/${courseId}`,
							},
						);
					}

					if (operation === 'addToBundles') {
						const memberId = this.getNodeParameter('memberId', i) as string;
						const bundleIds = (this.getNodeParameter('bundleIds', i) as string).split(',').map(id => id.trim());

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'PUT',
								url: `/members/${memberId}/bundles`,
								body: { bundles: bundleIds },
							},
						);
					}

					if (operation === 'removeFromBundles') {
						const memberId = this.getNodeParameter('memberId', i) as string;
						const bundleIds = (this.getNodeParameter('bundleIds', i) as string).split(',').map(id => id.trim());

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'DELETE',
								url: `/members/${memberId}/bundles`,
								body: { bundles: bundleIds },
							},
						);
					}

					if (operation === 'getBundles') {
						const memberId = this.getNodeParameter('memberId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: `/members/${memberId}/bundles`,
							},
						);
					}

					if (operation === 'findOrCreate') {
						const email = this.getNodeParameter('email', i) as string;
						
						// First try to find by email
						try {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'learningSuiteApi',
								{
									method: 'GET',
									url: '/members/by-email',
									qs: { email },
								},
							);
						} catch (error: unknown) {
							// If not found, create new member
							const err = error as IDataObject;
							if (err.httpCode === 404 || err.statusCode === 404) {
								const firstName = this.getNodeParameter('firstName', i) as string;
								const lastName = this.getNodeParameter('lastName', i) as string;

								responseData = await this.helpers.requestWithAuthentication.call(
									this,
									'learningSuiteApi',
									{
										method: 'POST',
										url: '/members',
										body: { email, firstName, lastName },
									},
								);
							} else {
								throw error;
							}
						}
						
					}
				}

				if (resource === 'course') {
					if (operation === 'getPublished') {
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: '/courses/published',
							},
						);
					}

					if (operation === 'getModules') {
						const courseId = this.getNodeParameter('courseId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: `/courses/${courseId}/modules`,
							},
						);
					}

					if (operation === 'getModulesForMember') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const memberId = this.getNodeParameter('memberId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: `/courses/${courseId}/modules/${memberId}`,
							},
						);
					}

					if (operation === 'getMembers') {
						const courseId = this.getNodeParameter('courseId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: `/courses/${courseId}/members`,
							},
						);
					}

					if (operation === 'getAccessRequests') {
						const courseId = this.getNodeParameter('courseId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: `/courses/${courseId}/access-requests`,
							},
						);
					}

					if (operation === 'getSubmissions') {
						const courseId = this.getNodeParameter('courseId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: `/courses/${courseId}/submissions`,
							},
						);
					}

					if (operation === 'createLesson') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const sectionId = this.getNodeParameter('sectionId', i) as string;
						const lessonName = this.getNodeParameter('lessonName', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const body: IDataObject = {
							name: lessonName,
							...additionalOptions,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'POST',
								url: `/courses/${courseId}/create-lesson/${sectionId}`,
								body,
							},
						);
					}
				}

				if (resource === 'group') {
					if (operation === 'getAll') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;
						const qs: IDataObject = {};

						if (additionalOptions.includeUsers) {
							qs.includeUsers = additionalOptions.includeUsers;
						}

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: '/groups',
								qs,
							},
						);
					}

					if (operation === 'create') {
						const groupName = this.getNodeParameter('groupName', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'POST',
								url: '/groups',
								body: { name: groupName },
							},
						);
					}

					if (operation === 'delete') {
						const groupId = this.getNodeParameter('groupId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'DELETE',
								url: `/group/${groupId}`,
							},
						);
					}

					if (operation === 'findByName') {
						const groupName = this.getNodeParameter('groupName', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;
						const qs: IDataObject = { name: groupName };

						if (additionalOptions.includeUsers) {
							qs.includeUsers = additionalOptions.includeUsers;
						}

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: '/groups/find-by-name',
								qs,
							},
						);
					}

					if (operation === 'findOrCreate') {
						const groupName = this.getNodeParameter('groupName', i) as string;
						
						// First try to find by name
						try {
							const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;
							const qs: IDataObject = { name: groupName };

							if (additionalOptions.includeUsers) {
								qs.includeUsers = additionalOptions.includeUsers;
							}

							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'learningSuiteApi',
								{
									method: 'GET',
									url: '/groups/find-by-name',
									qs,
								},
							);

							// If array is empty, create new group
							if (Array.isArray(responseData) && responseData.length === 0) {
								responseData = await this.helpers.requestWithAuthentication.call(
									this,
									'learningSuiteApi',
									{
										method: 'POST',
										url: '/groups',
										body: { name: groupName },
									},
								);
							} else if (Array.isArray(responseData) && responseData.length > 0) {
								// Return first found group
								responseData = responseData[0];
							}
						} catch (error) {
							// If not found, create new group
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'learningSuiteApi',
								{
									method: 'POST',
									url: '/groups',
									body: { name: groupName },
								},
							);
						}
					}

					if (operation === 'addMembers') {
						const userIds = (this.getNodeParameter('userIds', i) as string).split(',').map(id => id.trim());
						const groupIds = (this.getNodeParameter('groupIds', i) as string).split(',').map(id => id.trim());

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'PUT',
								url: '/add-members-to-groups',
								body: { userIds, groupIds },
							},
						);
					}

					if (operation === 'removeMembers') {
						const userIds = (this.getNodeParameter('userIds', i) as string).split(',').map(id => id.trim());
						const groupIds = (this.getNodeParameter('groupIds', i) as string).split(',').map(id => id.trim());

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'DELETE',
								url: '/remove-members-from-groups',
								body: { userIds, groupIds },
							},
						);
					}

					if (operation === 'getCourses') {
						const groupId = this.getNodeParameter('groupId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: `/group/${groupId}/courses`,
							},
						);
					}

					if (operation === 'addCourses') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						const courseIds = (this.getNodeParameter('courseIds', i) as string).split(',').map(id => id.trim());

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'PUT',
								url: `/group/${groupId}/courses`,
								body: { courseIds },
							},
						);
					}

					if (operation === 'removeCourses') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						const courseIds = (this.getNodeParameter('courseIds', i) as string).split(',').map(id => id.trim());

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'DELETE',
								url: `/group/${groupId}/courses`,
								body: { courseIds },
							},
						);
					}

					if (operation === 'addBundles') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						const bundleIds = (this.getNodeParameter('bundleIds', i) as string).split(',').map(id => id.trim());

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'PUT',
								url: `/group/${groupId}/bundles`,
								body: { bundleIds },
							},
						);
					}
				}

				if (resource === 'bundle') {
					if (operation === 'getAll') {
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: '/bundles',
							},
						);
					}

					if (operation === 'getMembers') {
						const bundleId = this.getNodeParameter('bundleId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: `/bundle/${bundleId}/members`,
							},
						);
					}
				}

				if (resource === 'role') {
					if (operation === 'getAll') {
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: '/user/roles',
							},
						);
					}
				}

				if (resource === 'hub') {
					if (operation === 'getAll') {
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: '/hubs',
							},
						);
					}

					if (operation === 'getTemplates') {
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: '/hub-templates',
							},
						);
					}

					if (operation === 'create') {
						const templateId = this.getNodeParameter('templateId', i) as string;
						const hubName = this.getNodeParameter('hubName', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const body: IDataObject = {
							templateId,
							name: hubName,
						};

						if (additionalOptions.hubDescription) {
							body.description = additionalOptions.hubDescription as string;
						}

						if (additionalOptions.publishHub !== undefined) {
							body.publish = additionalOptions.publishHub as boolean;
						}

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'POST',
								url: '/hub',
								body,
							},
						);
					}


					if (operation === 'addAccess') {
						const hubId = this.getNodeParameter('hubId', i) as string;
						const memberIds = this.getNodeParameter('memberIds', i, '') as string;
						const groupIds = this.getNodeParameter('groupIds', i, '') as string;
						const bundleIds = this.getNodeParameter('bundleIds', i, '') as string;

						const body: IDataObject = {};
						if (memberIds) body.memberIds = memberIds.split(',').map(id => id.trim());
						if (groupIds) body.groupIds = groupIds.split(',').map(id => id.trim());
						if (bundleIds) body.bundleIds = bundleIds.split(',').map(id => id.trim());

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'PUT',
								url: `/hub/${hubId}/access`,
								body,
							},
						);
					}

					if (operation === 'removeAccess') {
						const hubId = this.getNodeParameter('hubId', i) as string;
						const memberIds = this.getNodeParameter('memberIds', i, '') as string;
						const groupIds = this.getNodeParameter('groupIds', i, '') as string;
						const bundleIds = this.getNodeParameter('bundleIds', i, '') as string;

						const body: IDataObject = {};
						if (memberIds) body.memberIds = memberIds.split(',').map(id => id.trim());
						if (groupIds) body.groupIds = groupIds.split(',').map(id => id.trim());
						if (bundleIds) body.bundleIds = bundleIds.split(',').map(id => id.trim());

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'DELETE',
								url: `/hub/${hubId}/access`,
								body,
							},
						);
					}
				}

				if (resource === 'module') {
					if (operation === 'getLessons') {
						const moduleId = this.getNodeParameter('moduleId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: `/modules/${moduleId}/lessons`,
							},
						);
					}

					if (operation === 'getSections') {
						const moduleId = this.getNodeParameter('moduleId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: `/modules/${moduleId}/sections`,
							},
						);
					}

					if (operation === 'createUnlockOverride') {
						const moduleId = this.getNodeParameter('moduleId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'POST',
								url: '/create-module-unlock-override',
								body: { moduleId },
							},
						);
					}
				}

				if (resource === 'community') {
					if (operation === 'getAreas') {
						const limit = this.getNodeParameter('limit', i, 15) as number;
						const offset = this.getNodeParameter('offset', i, 0) as number;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: '/community/areas',
								qs: { limit, offset },
							},
						);
					}

					if (operation === 'getForums') {
						const limit = this.getNodeParameter('limit', i, 15) as number;
						const offset = this.getNodeParameter('offset', i, 0) as number;
						const areaId = this.getNodeParameter('areaId', i, '') as string;

						const qs: IDataObject = { limit, offset };
						if (areaId) {
							qs.areaId = areaId;
						}

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: '/community/forums',
								qs,
							},
						);
					}
				}

				if (resource === 'popup') {
					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i, 100) as number;
						const offset = this.getNodeParameter('offset', i, 0) as number;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: '/popups',
								qs: { limit, offset },
							},
						);
					}

					if (operation === 'get') {
						const popupId = this.getNodeParameter('popupId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: `/popups/${popupId}`,
							},
						);
					}

					if (operation === 'triggerForMember') {
						const popupId = this.getNodeParameter('popupId', i) as string;
						const memberId = this.getNodeParameter('memberId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'POST',
								url: `/popups/${popupId}/trigger/${memberId}`,
							},
						);
					}

					if (operation === 'removeTriggerForMember') {
						const popupId = this.getNodeParameter('popupId', i) as string;
						const memberId = this.getNodeParameter('memberId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'DELETE',
								url: `/popups/${popupId}/trigger/${memberId}`,
							},
						);
					}
				}

				if (resource === 'webhook') {
					if (operation === 'getSubscriptions') {
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: '/webhooks/subscription',
							},
						);
					}

					if (operation === 'getSubscription') {
						const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: `/webhooks/subscription/${subscriptionId}`,
							},
						);
					}

					if (operation === 'createSubscription') {
						const hookUrl = this.getNodeParameter('hookUrl', i) as string;
						const eventType = this.getNodeParameter('eventType', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const body: IDataObject = {
							hookUrl,
							type: eventType,
						};

						if (additionalOptions.courseInstanceId) {
							body.filter = { courseInstanceId: additionalOptions.courseInstanceId };
						}

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'POST',
								url: '/webhooks/subscription',
								body,
							},
						);
					}

					if (operation === 'updateSubscription') {
						const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
						const hookUrl = this.getNodeParameter('hookUrl', i) as string;
						const eventType = this.getNodeParameter('eventType', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const body: IDataObject = {
							hookUrl,
							type: eventType,
						};

						if (additionalOptions.courseInstanceId) {
							body.filter = { courseInstanceId: additionalOptions.courseInstanceId };
						}

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'PUT',
								url: `/webhooks/subscription/${subscriptionId}`,
								body,
							},
						);
					}

					if (operation === 'deleteSubscription') {
						const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'DELETE',
								url: `/webhooks/subscription/${subscriptionId}`,
							},
						);
					}

					if (operation === 'getSampleData') {
						const sampleDataType = this.getNodeParameter('sampleDataType', i) as string;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							{
								method: 'GET',
								url: `/webhooks/sample-data/${sampleDataType}`,
							},
						);
					}
				}

				if (resource === 'apiCall') {
					if (operation === 'makeRequest') {
						const httpMethod = this.getNodeParameter('httpMethod', i) as string;
						const endpoint = this.getNodeParameter('endpoint', i) as string;
						const queryParameters = this.getNodeParameter('queryParameters', i) as IDataObject;
						
						const options: IDataObject = {
							method: httpMethod,
							url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
						};

						// Add query parameters
						if (queryParameters.parameter && Array.isArray(queryParameters.parameter)) {
							const qs: IDataObject = {};
							for (const param of queryParameters.parameter) {
								if (param.name && param.value) {
									qs[param.name] = param.value;
								}
							}
							if (Object.keys(qs).length > 0) {
								options.qs = qs;
							}
						}

						// Add request body for POST/PUT/PATCH
						if (['POST', 'PUT', 'PATCH'].includes(httpMethod)) {
							const requestBody = this.getNodeParameter('requestBody', i, '{}') as string;
							try {
								options.body = JSON.parse(requestBody);
							} catch (error) {
								throw new NodeOperationError(this.getNode(), `Invalid JSON in request body: ${error}`);
							}
						}

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'learningSuiteApi',
							options,
						);
					}
				}

				if (Array.isArray(responseData)) {
					returnData.push.apply(returnData, responseData as IDataObject[]);
				} else if (responseData !== undefined) {
					returnData.push(responseData as IDataObject);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						error: (error as Error).message,
						input: items[i].json,
					});
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}