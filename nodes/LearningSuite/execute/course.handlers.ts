import type { IDataObject } from 'n8n-workflow';
import { lsRequest } from '../shared';
import type { ExecuteHandler } from '../exec.types';

const getPublished: ExecuteHandler = async (ctx) => lsRequest.call(ctx, 'GET', '/courses/published');

const getModules: ExecuteHandler = async (ctx, i) => {
	const courseId = ctx.getNodeParameter('courseId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/courses/${courseId}/modules`);
};

const getModulesForMember: ExecuteHandler = async (ctx, i) => {
	const courseId = ctx.getNodeParameter('courseId', i) as string;
	const memberId = ctx.getNodeParameter('memberId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/courses/${courseId}/modules/${memberId}`);
};

const getMembers: ExecuteHandler = async (ctx, i) => {
	const courseId = ctx.getNodeParameter('courseId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/courses/${courseId}/members`);
};

const getAccessRequests: ExecuteHandler = async (ctx, i) => {
	const courseId = ctx.getNodeParameter('courseId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/courses/${courseId}/access-requests`);
};

const getSubmissions: ExecuteHandler = async (ctx, i) => {
	const courseId = ctx.getNodeParameter('courseId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/courses/${courseId}/submissions`);
};

const createLesson: ExecuteHandler = async (ctx, i) => {
	const courseId = ctx.getNodeParameter('courseId', i) as string;
	const sectionId = ctx.getNodeParameter('sectionId', i) as string;
	const lessonName = ctx.getNodeParameter('lessonName', i) as string;
	const add = ctx.getNodeParameter('additionalOptions', i, {}) as IDataObject;

	type LessonSortPosition = 'first' | 'last';
	const sortPosRaw = add.lessonSortPosition as string | undefined;
	const sortPos: LessonSortPosition = sortPosRaw === 'first' || sortPosRaw === 'last' ? sortPosRaw : 'last';

	const body: IDataObject = {
		name: lessonName,
		lessonDescription: add.lessonDescription,
		htmlContent: add.htmlContent,
		videoUrl: add.videoUrl,
		thumbnailUrl: add.thumbnailUrl,
		immediatelyPublishCourse: add.immediatelyPublishCourse,
		lessonSortPosition: sortPos,
	};

	if (add.timestampInSecondsToGenerateThumbnail !== undefined && add.videoUrl) {
		const ts = Number(add.timestampInSecondsToGenerateThumbnail);
		if (!Number.isNaN(ts)) body.timestampInSecondsToGenerateThumbnail = ts;
	}
	for (const k of Object.keys(body)) {
		if (body[k] === '' || body[k] == null) delete body[k];
	}

	return lsRequest.call(ctx, 'POST', `/courses/${courseId}/create-lesson/${sectionId}`, { body });
};

export const courseHandlers = {
	getPublished,
	getModules,
	getModulesForMember,
	getMembers,
	getAccessRequests,
	getSubmissions,
	createLesson,
};
