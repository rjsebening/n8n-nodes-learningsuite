import type { IDataObject } from 'n8n-workflow';
import { lsRequest, toIdArray } from '../shared';
import type { ExecuteHandler } from '../exec.types';

const getByEmail: ExecuteHandler = async (ctx, i) => {
	const email = ctx.getNodeParameter('email', i) as string;
	return await lsRequest.call(ctx, 'GET', '/members/by-email', { qs: { email } });
};

const getById: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const includeGroups = ctx.getNodeParameter('includeGroups', i) as boolean;
	const qs: IDataObject = {};
	if (includeGroups) qs.includeGroups = includeGroups;
	return await lsRequest.call(ctx, 'GET', `/members/${memberId}`, { qs });
};

const getAll: ExecuteHandler = async (ctx, i) => {
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;
	const qs: IDataObject = {};
	const days = additionalOptions.daysNotLoggedInGte as number;
	const includeNever = additionalOptions.includeNeverLoggedIn as boolean;
	if (days !== undefined) qs.days_not_logged_in_gte = days;
	if (includeNever !== undefined) qs.include_never_logged_in = includeNever;
	return await lsRequest.call(ctx, 'GET', '/members', { qs });
};

const create: ExecuteHandler = async (ctx, i) => {
	const memberEmail = ctx.getNodeParameter('memberEmail', i) as string;
	const firstName = ctx.getNodeParameter('firstName', i) as string;
	const lastName = ctx.getNodeParameter('lastName', i) as string;
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;

	const body: IDataObject = {
		email: memberEmail,
		firstName,
		lastName,
		...additionalOptions,
	};
	for (const k of Object.keys(body)) {
		if (body[k] === '' || body[k] == null) delete body[k];
	}

	return lsRequest.call(ctx, 'POST', '/members', { body });
};

const update: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const firstName = ctx.getNodeParameter('firstName', i, '') as string;
	const lastName = ctx.getNodeParameter('lastName', i, '') as string;
	const updateFields = ctx.getNodeParameter('updateFields', i, {}) as IDataObject;

	const body: IDataObject = { ...updateFields };
	if (firstName) body.firstName = firstName;
	if (lastName) body.lastName = lastName;

	for (const k of Object.keys(body)) {
		if (body[k] === '' || body[k] == null) delete body[k];
	}

	return lsRequest.call(ctx, 'PUT', `/members/${memberId}`, { body });
};

const del: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	return await lsRequest.call(ctx, 'DELETE', `/members/${memberId}`);
};

const activateDeactivate: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const activateAction = ctx.getNodeParameter('activateAction', i) as string;
	return await lsRequest.call(ctx, 'PUT', `/members/${memberId}`, { body: { enabled: activateAction === 'activate' } });
};

const addToCourses: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const courseIds = toIdArray(ctx.getNodeParameter('courseIds', i));
	const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;
	return await lsRequest.call(ctx, 'PUT', `/members/${memberId}/courses`, {
		body: { courseIds, ...additionalOptions },
	});
};

const removeFromCourses: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const courseIds = toIdArray(ctx.getNodeParameter('courseIds', i));
	return await lsRequest.call(ctx, 'DELETE', `/members/${memberId}/courses`, { body: { courseIds } });
};

const getCourses: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/members/${memberId}/courses`);
};

const getCourseInfo: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const courseId = ctx.getNodeParameter('courseId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/members/${memberId}/course-info/${courseId}`);
};

const addToBundles: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const bundles = toIdArray(ctx.getNodeParameter('bundles', i));
	const add = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;
	const body: IDataObject = { bundles };
	if (add.accessGivenAtOverride) {
		body.accessGivenAtOverride = String(add.accessGivenAtOverride);
	}
	if (add.unlimitedAccess === true) {
		body.unlimitedAccess = true;
	} else if (add.accessUntilOverride) {
		body.accessUntilOverride = String(add.accessUntilOverride);
	}
	if (typeof add.disableAccessNotificationEmail === 'boolean') {
		body.disableAccessNotificationEmail = add.disableAccessNotificationEmail;
	}
	return lsRequest.call(ctx, 'PUT', `/members/${memberId}/bundles`, { body });
};

const removeFromBundles: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	const bundleIds = toIdArray(ctx.getNodeParameter('bundleIds', i));
	return lsRequest.call(ctx, 'DELETE', `/members/${memberId}/bundles`, {
		body: { bundleIds },
	});
};

const getBundles: ExecuteHandler = async (ctx, i) => {
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/members/${memberId}/bundles`);
};

const findOrCreate: ExecuteHandler = async (ctx, i) => {
	const email = ctx.getNodeParameter('email', i) as string;

	try {
		return await lsRequest.call(ctx, 'GET', '/members/by-email', { qs: { email } });
	} catch (error: any) {
		if (error?.httpCode === 404 || error?.statusCode === 404) {
			const firstName = ctx.getNodeParameter('firstName', i, '') as string;
			const lastName = ctx.getNodeParameter('lastName', i, '') as string;
			const additionalOptions = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;

			const body: IDataObject = { email, firstName, lastName, ...additionalOptions };
			for (const k of Object.keys(body)) {
				if (body[k] === '' || body[k] == null) delete body[k];
			}

			return await lsRequest.call(ctx, 'POST', '/members', { body });
		}
		throw error;
	}
};

export const memberHandlers = {
	getByEmail,
	getById,
	getAll,
	create,
	update,
	delete: del,
	activateDeactivate,
	addToCourses,
	removeFromCourses,
	getCourses,
	getCourseInfo,
	addToBundles,
	removeFromBundles,
	getBundles,
	findOrCreate,
};
