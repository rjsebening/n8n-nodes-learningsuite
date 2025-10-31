/*/nodes/LearningSuite/execute/teamMember.handlers.ts*/
import { lsRequest } from '../shared';
import type { ExecuteHandler } from '../exec.types';

const getAll: ExecuteHandler = async function (ctx, i) {
	const limit = Number(ctx.getNodeParameter('limit', i, 15));
	const offset = Number(ctx.getNodeParameter('offset', i, 0));

	const path = `/team-members?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`;
	return await lsRequest.call(ctx, 'GET', path);
};

const getByEmail: ExecuteHandler = async function (ctx, i) {
	const email = String(ctx.getNodeParameter('email', i)).trim();
	const path = `/team-members/by-email?email=${encodeURIComponent(email)}`;
	return await lsRequest.call(ctx, 'GET', path);
};

const getById: ExecuteHandler = async function (ctx, i) {
	const userId = ctx.getNodeParameter('userId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/team-members/${encodeURIComponent(userId)}`);
};

export const teamMemberHandlers = { getAll, getByEmail, getById };
