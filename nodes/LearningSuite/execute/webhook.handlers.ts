import type { IDataObject } from 'n8n-workflow';
import { lsRequest } from '../shared';
import type { ExecuteHandler } from '../exec.types';

// ---------------------------------------------------------
// Pro-Event Filter-Builder (gleiche Logik wie in Trigger-Node)
// === helpers (oben in der Datei platzieren) ===
const isEmpty = (obj: IDataObject | undefined | null) =>
	!obj || (Object.keys(obj).length === 0 && obj.constructor === Object);

const getCollection = (ctx: any, i: number, name: string): IDataObject => {
	try {
		const v = ctx.getNodeParameter(name, i, {}) as IDataObject | undefined;
		return v && typeof v === 'object' ? v : {};
	} catch {
		return {};
	}
};

const getString = (ctx: any, i: number, name: string, def = ''): string => {
	try {
		const v = ctx.getNodeParameter(name, i, def) as string | undefined;
		return (v ?? def) as string;
	} catch {
		return def;
	}
};

// === PATCH: buildFilterFromActionParams ===
function buildFilterFromActionParams(ctx: any, i: number, eventType: string): IDataObject | undefined {
	switch (eventType) {
		case 'login.new': {
			// 1) Versuche Collection (falls du meine erweiterte UI-Version nutzt)
			const col = getCollection(ctx, i, 'additionalLoginNew');
			let loginType = (col.loginType as string) || '';
			let userId = (col.userId as string) || '';

			// 2) Fallback auf TOP-LEVEL Felder (so wie es bei dir jetzt ist)
			if (!loginType) loginType = getString(ctx, i, 'loginType', '');
			if (!userId) userId = getString(ctx, i, 'userId', '');

			const f: IDataObject = {};
			if (loginType) f.loginType = loginType;
			if (userId) f.userId = userId;

			// Die API will IMMER ein filter-Objekt → leeres {} ist ok
			return f;
		}

		case 'customPopup.interaction': {
			const col = getCollection(ctx, i, 'additionalPopupInteraction');
			const f: IDataObject = {};
			if (col.customPopupId) f.customPopupId = String(col.customPopupId);
			if (col.interactionType) f.interactionType = String(col.interactionType);
			if (col.customPopupId && col.userId) f.userId = String(col.userId);
			return isEmpty(f) ? {} : f; // immer Objekt senden
		}

		case 'courseProgress.changed': {
			const threshold = ctx.getNodeParameter('threshold', i) as number;
			const col = getCollection(ctx, i, 'additionalCourseProgress');

			const f: IDataObject = {};

			// Prozent (UI) -> Integer (API). 0–100 clamp + floor.
			const pct = Number.isFinite(threshold) ? Math.floor(threshold) : 0;
			f.above = Math.min(100, Math.max(0, pct));

			// Optionaler Kursfilter: API erwartet courseInstanceId
			if (col.courseId) {
				f.courseInstanceId = String(col.courseId);
			}

			return isEmpty(f) ? {} : f;
		}

		case 'communityPost.created': {
			const col = getCollection(ctx, i, 'additionalCommunityPostCreated');
			const f: IDataObject = {};
			if (col.areaId) f.areaId = String(col.areaId);
			if (col.forumId) f.forumId = String(col.forumId);
			if (col.publishStatus && col.publishStatus !== 'both') f.publishStatus = String(col.publishStatus);
			if (col.userId) f.userId = String(col.userId);
			return isEmpty(f) ? {} : f;
		}

		case 'communityPost.moderated': {
			const col = getCollection(ctx, i, 'additionalCommunityPostModerated');
			const f: IDataObject = {};
			if (col.areaId) f.areaId = String(col.areaId);
			if (col.forumId) f.forumId = String(col.forumId);
			if (col.approved && col.approved !== 'both') f.approved = col.approved === 'approved';
			if (col.userId) f.userId = String(col.userId);
			return isEmpty(f) ? {} : f;
		}

		case 'feedback.created':
		case 'exam.completed':
		case 'exam.graded': {
			const col = getCollection(ctx, i, 'additionalFeedbackExam');
			// API will courseInstanceId
			return col.courseId ? { courseInstanceId: String(col.courseId) } : {};
		}

		case 'accessRequest.created': {
			// UI-Feld ist top-level
			const courseId = getString(ctx, i, 'courseId', '');
			return courseId ? { courseInstanceId: courseId } : {};
		}

		case 'group.userAccessChanged': {
			const actionType = getString(ctx, i, 'actionType', '');
			const col = getCollection(ctx, i, 'additionalGroupAccess');
			const f: IDataObject = {};
			if (actionType) f.actionType = actionType; // 'added' | 'removed'
			if (col.groupId) f.groupId = String(col.groupId);
			return isEmpty(f) ? {} : f;
		}

		case 'lesson.completed': {
			const col = getCollection(ctx, i, 'additionalLessonCompleted');
			const f: IDataObject = {};
			if (col.courseId) f.courseInstanceId = String(col.courseId); // Mapping!
			if (col.moduleId) f.moduleId = String(col.moduleId);
			if (col.lessonId) f.lessonId = String(col.lessonId);
			return isEmpty(f) ? {} : f;
		}

		case 'submission.created': {
			const col = getCollection(ctx, i, 'additionalSubmission');
			// API will courseInstanceId
			return col.courseId ? { courseInstanceId: String(col.courseId) } : {};
		}
	}

	return {}; // Default: immer Objekt
}

// ---------------------------------------------------------
// Handlers
const getSubscriptions: ExecuteHandler = async (ctx) => lsRequest.call(ctx, 'GET', '/webhooks/subscription');

const getSubscription: ExecuteHandler = async (ctx, i) => {
	const subscriptionId = ctx.getNodeParameter('subscriptionId', i) as string;
	return await lsRequest.call(ctx, 'GET', `/webhooks/subscription/${encodeURIComponent(subscriptionId)}`);
};

const createSubscription: ExecuteHandler = async (ctx, i) => {
	const hookUrl = ctx.getNodeParameter('hookUrl', i) as string;
	const eventType = ctx.getNodeParameter('eventType', i) as string;

	const filter = buildFilterFromActionParams(ctx, i, eventType) || {};

	const body: IDataObject = { hookUrl, type: eventType, filter };
	return await lsRequest.call(ctx, 'POST', '/webhooks/subscription', { body });
};

const updateSubscription: ExecuteHandler = async (ctx, i) => {
	const subscriptionId = ctx.getNodeParameter('subscriptionId', i) as string;
	const hookUrl = ctx.getNodeParameter('hookUrl', i) as string;
	const eventType = ctx.getNodeParameter('eventType', i) as string;

	const filter = buildFilterFromActionParams(ctx, i, eventType) || {};

	const body: IDataObject = { hookUrl, type: eventType, filter };
	return await lsRequest.call(ctx, 'PUT', `/webhooks/subscription/${encodeURIComponent(subscriptionId)}`, { body });
};

const deleteSubscription: ExecuteHandler = async (ctx, i) => {
	const subscriptionId = ctx.getNodeParameter('subscriptionId', i) as string;
	return await lsRequest.call(ctx, 'DELETE', `/webhooks/subscription/${encodeURIComponent(subscriptionId)}`);
};

const getSampleData: ExecuteHandler = async (ctx, i) => {
	const sampleDataType = ctx.getNodeParameter('sampleDataType', i) as string;
	return await lsRequest.call(ctx, 'GET', `/webhooks/sample-data/${encodeURIComponent(sampleDataType)}`);
};

export const webhookHandlers = {
	getSubscriptions,
	getSubscription,
	createSubscription,
	updateSubscription,
	deleteSubscription,
	getSampleData,
};
