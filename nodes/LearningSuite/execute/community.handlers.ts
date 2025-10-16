import type { IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { lsRequest, toIdArray } from '../shared';
import type { ExecuteHandler } from '../exec.types';

const getAreas: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 50) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	return await lsRequest.call(ctx, 'GET', '/community/areas', { qs: { limit, offset } });
};

const getForums: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 50) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	const areaId = ctx.getNodeParameter('areaId', i, '') as string;
	const qs: IDataObject = { limit, offset };
	if (areaId) qs.areaId = areaId;
	return await lsRequest.call(ctx, 'GET', '/community/forums', { qs });
};

const getBadges: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 15) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	const badgeGroupId = ctx.getNodeParameter('badgeGroupId', i, '') as string;
	const qs: IDataObject = { limit, offset };
	if (badgeGroupId) qs.badgeGroupId = badgeGroupId;
	return await lsRequest.call(ctx, 'GET', '/community/badges', { qs });
};

const assignBadgesToUser: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const badgeIds = toIdArray(ctx.getNodeParameter('badgeIds', i));

	if (!badgeIds.length) {
		throw new NodeOperationError(ctx.getNode(), 'Bitte mindestens ein Badge auswählen.');
	}

	const body: IDataObject = { userId: memberId, badgeIds };
	return await lsRequest.call(ctx, 'PUT', '/community/badges/user', { body });
};

const removeBadgesFromUser: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const badgeIds = toIdArray(ctx.getNodeParameter('badgeIds', i));

	if (!badgeIds.length) {
		throw new NodeOperationError(ctx.getNode(), 'Bitte mindestens ein Badge auswählen.');
	}

	const body: IDataObject = { userId: memberId, badgeIds };
	return await lsRequest.call(ctx, 'DELETE', '/community/badges/user', { body });
};

const commentOnPost: ExecuteHandler = async (ctx, i) => {
	const postId = ctx.getNodeParameter('postId', i) as string;
	const authorUserId = ctx.getNodeParameter('authorUserId', i) as string;
	const commentText = ctx.getNodeParameter('commentText', i) as string;
	const answerToCommentId = ctx.getNodeParameter('answerToCommentId', i, '') as string;
	const enableWebhookTriggering = ctx.getNodeParameter('enableWebhookTriggering', i, false) as boolean;

	// Pflichtfelder prüfen
	if (!postId) {
		throw new NodeOperationError(ctx.getNode(), 'Bitte eine Post-ID angeben.');
	}
	if (!authorUserId) {
		throw new NodeOperationError(ctx.getNode(), 'Bitte eine Author-User-ID angeben.');
	}
	if (!commentText) {
		throw new NodeOperationError(ctx.getNode(), 'Kommentartext darf nicht leer sein.');
	}

	// Request Body
	const body: IDataObject = {
		authorUserId,
		commentText,
	};

	// optionale Felder nur hinzufügen, wenn gesetzt
	if (answerToCommentId) body.answerToCommentId = answerToCommentId;
	if (enableWebhookTriggering) body.enableWebhookTriggering = enableWebhookTriggering;

	// Request ausführen
	return await lsRequest.call(ctx, 'POST', `/community/posts/${postId}/comments`, { body });
};

export const communityHandlers = {
	getAreas,
	getForums,
	getBadges,
	assignBadgesToUser,
	removeBadgesFromUser,
	commentOnPost,
};
