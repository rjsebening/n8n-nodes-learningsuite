import type { IDataObject } from 'n8n-workflow';
import { lsRequest } from '../shared';
import type { ExecuteHandler } from '../exec.types';

const getLessons: ExecuteHandler = async (ctx, i) => {
	const moduleId = ctx.getNodeParameter('moduleId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/modules/${moduleId}/lessons`);
};

const getSections: ExecuteHandler = async (ctx, i) => {
	const moduleId = ctx.getNodeParameter('moduleId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/modules/${moduleId}/sections`);
};

const createUnlockOverride: ExecuteHandler = async (ctx, i) => {
	const moduleId = ctx.getNodeParameter('moduleId', i) as string;
	const memberId = ctx.getNodeParameter('memberId', i, '') as string;
	/*const courseInstanceId = ctx.getNodeParameter('courseInstanceId', i, '') as string;*/
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;
	const newModuleAccess = ctx.getNodeParameter('newModuleAccess', i, '') as string;

	const body: IDataObject = {
		moduleId,
		userId: memberId || undefined,
		/*courseInstanceId: courseInstanceId || undefined,*/
		new_module_access: newModuleAccess || undefined,
		...additionalOptions,
	};

	// Leere Felder entfernen
	Object.keys(body).forEach((k) => {
		if (body[k] === '' || body[k] === undefined || body[k] === null) delete body[k];
	});

	return await lsRequest.call(ctx, 'POST', '/create-module-unlock-override', { body });
};

export const moduleHandlers = {
	getLessons,
	getSections,
	createUnlockOverride,
};
