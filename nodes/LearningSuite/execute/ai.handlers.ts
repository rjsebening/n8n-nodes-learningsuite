import type { IDataObject } from 'n8n-workflow';
import { lsRequest } from '../shared';
import type { ExecuteHandler } from '../exec.types';

const ragChat: ExecuteHandler = async (ctx, i) => {
	const body: IDataObject = {
		question: ctx.getNodeParameter('question', i) as string,
		userId: ctx.getNodeParameter('userId', i, undefined),
		conversationId: ctx.getNodeParameter('conversationId', i, undefined),
		addCitations: ctx.getNodeParameter('addCitations', i, false),
		systemPromptAddition: ctx.getNodeParameter('systemPromptAddition', i, undefined),
		answerLength: ctx.getNodeParameter('answerLength', i, 'standard'),
		tone: ctx.getNodeParameter('tone', i, 'neutral'),
		format: ctx.getNodeParameter('format', i, 'markdown'),
		unlockContentDrip: ctx.getNodeParameter('unlockContentDrip', i, false),
	};

	return await lsRequest.call(ctx, 'POST', '/ai/rag-chat', { body });
};

export const aiHandlers = {
	ragChat,
};
