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

const getCommunityPosts: ExecuteHandler = async (ctx, i) => {
	const limit = ctx.getNodeParameter('limit', i, 15) as number;
	const offset = ctx.getNodeParameter('offset', i, 0) as number;
	const areaId = ctx.getNodeParameter('areaId', i, '') as string;
	const forumId = ctx.getNodeParameter('forumId', i, '') as string;
	const order = ctx.getNodeParameter('order', i, 'latest') as string;

	const qs: IDataObject = { limit, offset, order };
	if (areaId) qs.areaId = areaId;
	if (forumId) qs.forumId = forumId;

	return await lsRequest.call(ctx, 'GET', '/community/posts', { qs });
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
		throw new NodeOperationError(ctx.getNode(), 'Please select at least one badge.');
	}

	const body: IDataObject = { userId: memberId, badgeIds };
	return await lsRequest.call(ctx, 'PUT', '/community/badges/user', { body });
};

const removeBadgesFromUser: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const badgeIds = toIdArray(ctx.getNodeParameter('badgeIds', i));

	if (!badgeIds.length) {
		throw new NodeOperationError(ctx.getNode(), 'Please select at least one badge.');
	}

	const body: IDataObject = { userId: memberId, badgeIds };
	return await lsRequest.call(ctx, 'DELETE', '/community/badges/user', { body });
};

const commentOnPost: ExecuteHandler = async (ctx, i) => {
	const postId = ctx.getNodeParameter('postId', i) as string;
	const authorType = ctx.getNodeParameter('authorType', i) as 'member' | 'team';
	const authorMemberId = ctx.getNodeParameter('authorMemberId', i, '') as string;
	const authorTeamMemberId = ctx.getNodeParameter('authorTeamMemberId', i, '') as string;
	const commentText = ctx.getNodeParameter('commentText', i) as string;
	const answerToCommentId = ctx.getNodeParameter('answerToCommentId', i, '') as string;
	const enableWebhookTriggering = ctx.getNodeParameter('enableWebhookTriggering', i, false) as boolean;

	if (!postId) {
		throw new NodeOperationError(ctx.getNode(), 'Please provide a post ID.');
	}
	if (!commentText) {
		throw new NodeOperationError(ctx.getNode(), 'The comment text cannot be empty.');
	}

	const authorUserId = authorType === 'member' ? authorMemberId : authorType === 'team' ? authorTeamMemberId : '';

	if (!authorUserId) {
		throw new NodeOperationError(
			ctx.getNode(),
			authorType === 'member' ? 'Please select an author (member).' : 'Please select an author (team member).',
		);
	}

	const body: IDataObject = { authorUserId, commentText };
	if (answerToCommentId) body.answerToCommentId = answerToCommentId;
	if (enableWebhookTriggering) body.enableWebhookTriggering = true;

	return await lsRequest.call(ctx, 'POST', `/community/posts/${postId}/comments`, { body });
};

export const communityHandlers = {
	getAreas,
	getForums,
	getBadges,
	assignBadgesToUser,
	removeBadgesFromUser,
	commentOnPost,
	getCommunityPosts,
};
