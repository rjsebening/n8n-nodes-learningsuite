import type { INodeProperties } from 'n8n-workflow';

export const customFieldsProperties: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                 OPERATION                                  */
	/* -------------------------------------------------------------------------- */
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

	/* -------------------------------------------------------------------------- */
	/*                               PAGINATION                                   */
	/* -------------------------------------------------------------------------- */
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

	/* -------------------------------------------------------------------------- */
	/*                                 COMMON                                     */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'member_getMembers' },
		default: '',
		required: true,
		description:
			'The ID of the user whose custom field data should be accessed. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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

	/* -------------------------------------------------------------------------- */
	/*                              META FILTERS                                  */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Custom Field Card Name or ID',
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
				operation: ['getCategories', 'getDefinitions', 'getProfiles', 'getProfilesExpanded'],
			},
		},
	},

	/* -------------------------------------------------------------------------- */
	/*                               FIELD VALUES                                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Field Key Name or ID',
		name: 'fieldKey',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'customFields_getDefinitions' },
		description:
			'Custom field key ("Property ID" in the UI). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'getFieldValues'],
			},
		},
	},
	{
		displayName: 'Profile Index',
		name: 'setField_profileIndex',
		type: 'number',
		default: null,
		description: 'Profile index to update. Defaults to the first profile.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue'],
			},
		},
	},
	{
		displayName: 'Field Value',
		name: 'setField_fieldValue',
		type: 'json',
		default: `{
  "fieldValue": "string, number, boolean, array or object depending on the field definition."
}`,
		description: 'Value to set. Can be string, number, boolean, array or object depending on the field definition.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue'],
			},
		},
	},
	{
		displayName: 'Fields',
		name: 'fields',
		type: 'json',
		default: `[
  {
    "fieldKey": "",
    "profileIndex": null,
    "fieldValue": "string, number, boolean, array or object depending on the field definition."
  },
  {
    "fieldKey": "",
    "profileIndex": null,
    "fieldValue": "string, number, boolean, array or object depending on the field definition."
  }
]`,
		description: 'Array of field updates. Each item must contain fieldKey and fieldValue. profileIndex is optional.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setMultipleFieldValues'],
			},
		},
	},

	/* -------------------------------------------------------------------------- */
	/*                                  PROFILES                                  */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Card Name or ID',
		name: 'cardId',
		type: 'options',
		default: '',
		required: true,
		description:
			'The custom field card whose profile values should be retrieved or updated. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'customFields_getCards',
		},
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['getProfileByCard', 'updateProfileField'],
			},
		},
	},
	{
		displayName: 'Profile Field Update',
		name: 'profileFieldPayload',
		type: 'json',
		default: `{
  "profileIndex": null,
  "profileName": null,
  "fieldKey": "",
  "fieldValue": "string, number, boolean, array or object depending on the field definition."
}`,
		description:
			'Payload to update a custom field value within a profile. Either profileIndex or profileName can be set.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['updateProfileField'],
			},
		},
	},
];
