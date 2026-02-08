//n8n-nodes-learningsuite/nodes/LearningSuite/descriptions/customFields.properties.ts
import type { INodeProperties } from 'n8n-workflow';

export const customFieldsProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['customFields'] } },
		default: 'getCards',
		options: [
			{
				name: 'Get Cards',
				value: 'getCards',
				description: 'Retrieve all custom field cards',
				action: 'Retrieve all custom field cards',
			},
			{
				name: 'Get Cards (Expanded)',
				value: 'getCardsExpanded',
				description: 'Retrieve custom field cards including their definitions and categories',
				action: 'Retrieve custom field cards including their definitions and categories',
			},
			{
				name: 'Get Categories',
				value: 'getCategories',
				description: 'Retrieve custom field categories',
				action: 'Retrieve custom field categories',
			},
			{
				name: 'Get Definitions',
				value: 'getDefinitions',
				description: 'Retrieve custom field definitions',
				action: 'Retrieve custom field definitions',
			},
			{
				name: 'Get Field Values',
				value: 'getFieldValues',
				description: 'Retrieve the values of a custom field for a user',
				action: 'Retrieve the values of a custom field for a user',
			},
			{
				name: 'Get Profile by Card',
				value: 'getProfileByCard',
				description: 'Retrieve the values of a custom field card profile for a user',
				action: 'Retrieve the values of a custom field card profile for a user',
			},
			{
				name: 'Get Profiles',
				value: 'getProfiles',
				description: 'Retrieve custom field profiles of a user',
				action: 'Retrieve custom field profiles of a user',
			},
			{
				name: 'Get Profiles (Expanded)',
				value: 'getProfilesExpanded',
				description: 'Retrieve custom field profiles including their values',
				action: 'Retrieve custom field profiles including their values',
			},
			{
				name: 'Get Store',
				value: 'getStore',
				description: 'Retrieve the complete custom field store of a user',
				action: 'Retrieve the complete custom field store of a user',
			},
			{
				name: 'Set Field Value',
				value: 'setFieldValue',
				description: 'Set the value of a single custom field for a user',
				action: 'Set the value of a single custom field for a user',
			},
			{
				name: 'Set Multiple Field Values',
				value: 'setMultipleFieldValues',
				description: 'Set multiple custom field values for a user in one request',
				action: 'Set multiple custom field values for a user in one request',
			},
			{
				name: 'Update Profile Field',
				value: 'updateProfileField',
				description: 'Update a custom field value within a profile of a custom field card',
				action: 'Update a custom field value within a profile of a custom field card',
			},
		],
	},
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'member_getMembers',
		},
		required: true,
		default: '',
		description:
			'The ID of the user whose custom field data should be accessed. Choose from the list, or specify an ID using an expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: [
					'getFieldValues',
					'getProfileByCard',
					'getProfiles',
					'getProfilesExpanded',
					'getStore',
					'setFieldValue',
					'setMultipleFieldValues',
					'updateProfileField',
				],
			},
		},
	},
	{
		displayName: 'Card Name or ID',
		name: 'customFieldCardId',
		type: 'options',
		default: '',
		description:
			'Filter results by a specific custom field card. Choose from the list or specify an ID using an expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'customFields_getCards',
		},
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: [
					'getCategories',
					'getDefinitions',
					'getProfiles',
					'getProfilesExpanded',
					'getProfileByCard',
					'updateProfileField',
				],
			},
		},
	},
	{
		displayName: 'Profile Index',
		name: 'profileIndex',
		type: 'number',
		default: null,
		description: 'If specified, the profile with this ID is used. Takes precedence over Profile Name.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField', 'setMultipleFieldValues', 'getProfileByCard'],
			},
		},
	},
	{
		displayName: 'Profile Name',
		name: 'profileName',
		type: 'string',
		default: '',
		description: 'If specified, the first profile with this name is used. Ignored if Profile Index is set.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['updateProfileField', 'getProfileByCard'],
			},
		},
	},
	{
		displayName: 'Field Key Name or ID',
		name: 'fieldKey',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'customFields_getDefinitions',
			loadOptionsDependsOn: ['customFieldCardId'],
		},
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'getFieldValues', 'updateProfileField'],
			},
		},
		default: '',
	},
	{
		displayName: 'Field Type Name or ID',
		name: 'fieldType',
		type: 'options',
		default: '',
		description:
			'Automatically detected from the selected field. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'customFields_getFieldType',
			loadOptionsDependsOn: ['fieldKey'],
		},
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
			},
		},
		options: [],
	},
	{
		displayName: 'Field Value',
		name: 'fieldValueString',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'Enter text value',
		description: 'The string value to set for this custom field',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['string'],
			},
		},
	},
	{
		displayName: 'Field Value',
		name: 'fieldValueNumber',
		type: 'number',
		default: 0,
		required: true,
		placeholder: 'Enter numeric value',
		description: 'The numeric value to set for this custom field',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['number'],
			},
		},
	},
	{
		displayName: 'Field Value',
		name: 'fieldValueBoolean',
		type: 'boolean',
		default: false,
		required: true,
		description: 'Whether to set a boolean value for this user-defined field',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['boolean'],
			},
		},
	},
	{
		displayName: 'Field Value',
		name: 'fieldValueDateTime',
		type: 'dateTime',
		default: '',
		required: true,
		placeholder: 'Select date/time',
		description: 'The date/time value to set for this custom field',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['dateTime'],
			},
		},
	},
	{
		displayName: 'Field Value Name or ID',
		name: 'fieldValueOption',
		type: 'options',
		default: '',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'customFields_getFieldOptions',
			loadOptionsDependsOn: ['fieldKey'],
		},
		description:
			'Select a value from the available options. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['option'],
			},
		},
	},
	{
		displayName: 'Field Value Names or IDs',
		name: 'fieldValueMultiOptions',
		type: 'multiOptions',
		default: [],
		required: true,
		typeOptions: {
			loadOptionsMethod: 'customFields_getFieldOptions',
			loadOptionsDependsOn: ['fieldKey'],
		},
		description:
			'Select one or more values from the available options. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['multiOptions'],
			},
		},
	},
	{
		displayName: 'Field Value (Files)',
		name: 'fieldValueFiles',
		type: 'json',
		default: `[
			{
			// Note: type 'files' is not supported yet
			"fileId": "file_abc123",
			"name": "vertrag_2026.pdf",
			"mimeType": "application/pdf",
			"fileSize": 234567
			}
		 ]`,
		description: 'JSON array of file objects',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['files'],
			},
		},
	},
	{
		displayName: 'Field Value (Images)',
		name: 'fieldValueImages',
		type: 'json',
		default: `[
			{
			// Note: type 'images' is not supported yet
			"fileId": "file_img_001",
			"previewThumb": "https://cdn.example.com/thumbs/file_img_001.jpg",
			"mimeType": "image/jpeg",
			"dimensions": {
				"width": 1200,
				"height": 800
			},
			"meanColor": "#a1b2c3",
			"dominantColor": "#8899aa",
			"fileSize": 345678
			}
		 ]`,
		description: 'JSON array of image objects',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['images'],
			},
		},
	},
	{
		displayName: 'Field Value (Videos)',
		name: 'fieldValueVideos',
		type: 'json',
		default: `[
			{
		    // Note: type 'videos' is not supported yet
			"fileId": "file_vid_001",
			"thumbnailFileId": "file_thumb_001",
			"aspectRatio": 1.7777778,
			"mimeType": "video/mp4",
			"fileSize": 58234567
			}
		 ]`,
		required: true,
		description: 'JSON array of video objects',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['videos'],
			},
		},
	},
	{
		displayName: 'Field Value',
		name: 'fieldValueFallback',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'Enter value',
		description: 'The value to set for this custom field',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
			},
			hide: {
				fieldType: ['string', 'number', 'boolean', 'dateTime', 'option', 'multiOptions', 'files', 'images', 'videos'],
			},
		},
	},
	{
		displayName: 'Field Values',
		name: 'fieldValues',
		type: 'resourceMapper',
		noDataExpression: true,
		required: true,
		default: {
			mappingMode: 'defineBelow',
			value: null,
		},
		typeOptions: {
			resourceMapper: {
				resourceMapperMethod: 'getMultipleCustomFieldValueResourceMapperFields',
				mode: 'add',
				fieldWords: {
					singular: 'field',
					plural: 'fields',
				},
				addAllFields: true,
				multiKeyMatch: false,
				supportAutoMap: false,
			},
		},
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setMultipleFieldValues'],
			},
		},
	},

	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['getCards', 'getCardsExpanded', 'getCategories', 'getDefinitions'],
			},
		},
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		description: 'Number of results to skip before starting to return items',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['getCards', 'getCardsExpanded', 'getCategories', 'getDefinitions'],
			},
		},
	},
];
