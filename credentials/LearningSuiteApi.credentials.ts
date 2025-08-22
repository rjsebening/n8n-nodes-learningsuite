import {
	ICredentialType,
	INodeProperties,
	IAuthenticate,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class LearningSuiteApi implements ICredentialType {
	name = 'learningSuiteApi';
	displayName = 'LearningSuite API';
	documentationUrl = 'https://api.learningsuite.io/api/v1/docs/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.learningsuite.io/api/v1',
			description: 'Base URL of the LearningSuite API',
		},
	];

	authenticate: IAuthenticate = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-KEY': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/users',
			method: 'GET',
		},
	};
}
