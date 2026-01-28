import type { INodeProperties } from 'n8n-workflow';

export const aiProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'ragChat',
		displayOptions: { show: { resource: ['ai'] } },
		options: [
			{
				name: 'RAG Chat',
				value: 'ragChat',
				description: 'Ask a question using the AI RAG chat endpoint',
				action: 'Ask AI question',
			},
		],
	},
	{
		displayName: 'Question',
		name: 'question',
		type: 'string',
		required: true,
		default: '',
		description: 'The question to ask the AI',
		displayOptions: { show: { resource: ['ai'], operation: ['ragChat'] } },
	},
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'member_getMembers' },
		default: '',
		description:
			'The ID of the user making the request. Used to personalize and scope the AI response. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: { show: { resource: ['ai'], operation: ['ragChat'] } },
	},
	{
		displayName: 'Conversation ID',
		name: 'conversationId',
		type: 'string',
		default: '',
		description: 'If set, the conversation history with this ID will be taken into account',
		displayOptions: { show: { resource: ['ai'], operation: ['ragChat'] } },
	},
	{
		displayName: 'Answer Length',
		name: 'answerLength',
		type: 'options',
		default: 'standard',
		description: 'The desired length of the AI’s answer',
		displayOptions: { show: { resource: ['ai'], operation: ['ragChat'] } },
		options: [
			{
				name: 'Concise',
				value: 'concise',
				description: 'A short and to-the-point answer',
			},
			{
				name: 'Standard',
				value: 'standard',
				description: 'A balanced answer with sufficient detail',
			},
			{
				name: 'Detailed',
				value: 'detailed',
				description: 'A comprehensive and detailed answer',
			},
		],
	},
	{
		displayName: 'Tone',
		name: 'tone',
		type: 'options',
		default: 'neutral',
		description: 'The desired tone of the AI’s answer',
		displayOptions: { show: { resource: ['ai'], operation: ['ragChat'] } },
		options: [
			{
				name: 'Friendly',
				value: 'friendly',
				description: 'A warm and approachable tone',
			},
			{
				name: 'Neutral',
				value: 'neutral',
				description: 'A neutral and factual tone',
			},
			{
				name: 'Professional',
				value: 'professional',
				description: 'A formal and professional tone',
			},
		],
	},
	{
		displayName: 'Format',
		name: 'format',
		type: 'options',
		default: 'markdown',
		description: 'The desired output format of the AI’s answer',
		displayOptions: { show: { resource: ['ai'], operation: ['ragChat'] } },
		options: [
			{
				name: 'Markdown',
				value: 'markdown',
				description: 'Formatted output using Markdown',
			},
			{
				name: 'Plain Text',
				value: 'plaintext',
				description: 'Unformatted plain text output',
			},
		],
	},
	{
		displayName: 'Add Citations',
		name: 'addCitations',
		type: 'boolean',
		default: false,
		description: 'Whether the AI will add citations to its answer',
		displayOptions: { show: { resource: ['ai'], operation: ['ragChat'] } },
	},
	{
		displayName: 'Unlock Content Drip',
		name: 'unlockContentDrip',
		type: 'boolean',
		default: false,
		description: 'Whether the AI will have access to content that is normally restricted by content drip settings',
		displayOptions: { show: { resource: ['ai'], operation: ['ragChat'] } },
	},
	{
		displayName: 'System Prompt Addition',
		name: 'systemPromptAddition',
		type: 'string',
		default: '',
		description: 'Additional system prompt instructions to guide the AI’s behavior',
		displayOptions: { show: { resource: ['ai'], operation: ['ragChat'] } },
	},
];
