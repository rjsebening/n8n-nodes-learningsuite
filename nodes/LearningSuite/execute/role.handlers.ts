import { lsRequest } from '../shared';
import type { ExecuteHandler } from '../exec.types';

const getAll: ExecuteHandler = async (ctx) => lsRequest.call(ctx, 'GET', '/user/roles');

export const roleHandlers = { getAll };
