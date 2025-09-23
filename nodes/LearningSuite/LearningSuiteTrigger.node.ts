import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeConnectionType,
	IDataObject,
	JsonObject,
	NodeApiError,
} from 'n8n-workflow';

import { apiRequest } from './shared/request';
import { instantProperties as instantProperties } from './descriptions/trigger.instant.properties';
import { methods as credentialMethods } from './methods/credentialTest';

// LoadOptions gezielt binden
import * as loMember from './methods/loadOptions/member.loadOptions';
import * as loCourse from './methods/loadOptions/course.loadOptions';
import * as loCommunity from './methods/loadOptions/community.loadOptions';
import * as loGroup from './methods/loadOptions/group.loadOptions';
import * as loModule from './methods/loadOptions/module.loadOptions';
import * as loPopup from './methods/loadOptions/popup.loadOptions';

/** Alle Instant-Events (nur Webhooks) */
const INSTANT_EVENTS = new Set<string>([
	'accessRequest.created',
	'communityPost.created',
	'communityPost.moderated',
	'courseProgress.changed',
	'customPopup.interaction',
	'exam.completed',
	'exam.graded',
	'feedback.created',
	'group.userAccessChanged',
	'lesson.completed',
	'login.new',
	'submission.created',
]);

// Sichere Helper-Funktion: greift auf verschachtelte Parameter zu, ohne Exceptions zu werfen.
// Gibt immer einen string zurück ('' wenn nicht gesetzt).
function getParamSafe(self: IHookFunctions, path: string): string {
	try {
		const v = self.getNodeParameter(path) as unknown;
		if (v === null || v === undefined) return '';
		// Strings direkt trimmen
		if (typeof v === 'string') return v.trim();
		// Booleans/Numbers zu string
		if (typeof v === 'number' || typeof v === 'boolean') return String(v);
		// Objekte/Arrays → leer lassen; wir erwarten in Filtern nur Skalare
		return '';
	} catch {
		return '';
	}
}

/**
 * Baut den gewünschten Filter für Webhook-Subscriptions anhand der UI-Parameter.
 * Achtung: liest NUR noch aus den neuen "Additional"-Collections.
 */
function buildDesiredFilter(this: IHookFunctions, event: string): { filter: IDataObject; hasFilter: boolean } {
	const filter: IDataObject = {};
	let hasFilter = false;

	// Neuer Setter: kann optional auch leere Strings zulassen (includeEmpty)
	const set = (k: string, v: any, opts: { includeEmpty?: boolean } = {}) => {
		const isEmpty = v === '' || v === undefined || v === null;
		if (isEmpty && !opts.includeEmpty) return;
		filter[k] = v;
		hasFilter = true;
	};

	// ---------- Community Post Created ----------
	if (event === 'communityPost.created') {
		const areaId = getParamSafe(this, 'additionalCommunityPostCreated.areaId');
		const forumId = getParamSafe(this, 'additionalCommunityPostCreated.forumId');
		const publishStatus = getParamSafe(this, 'additionalCommunityPostCreated.publishStatus');
		const userId = getParamSafe(this, 'additionalCommunityPostCreated.userId');
		set('areaId', areaId, { includeEmpty: true });
		set('forumId', forumId, { includeEmpty: true });
		set('publishStatus', publishStatus, { includeEmpty: true });
		set('userId', userId, { includeEmpty: true });
	}

	// ---------- Community Post Moderated ----------
	if (event === 'communityPost.moderated') {
		const areaId = getParamSafe(this, 'additionalCommunityPostModerated.areaId');
		const forumId = getParamSafe(this, 'additionalCommunityPostModerated.forumId');
		const approved = getParamSafe(this, 'additionalCommunityPostModerated.approved');
		const userId = getParamSafe(this, 'additionalCommunityPostModerated.userId');
		set('areaId', areaId, { includeEmpty: true });
		set('forumId', forumId, { includeEmpty: true });
		set('approved', approved, { includeEmpty: true });
		set('userId', userId, { includeEmpty: true });
	}

	// ---------- Group User Access Changed ----------
	if (event === 'group.userAccessChanged') {
		const groupId = getParamSafe(this, 'additionalGroupAccess.groupId');
		const actionType = getParamSafe(this, 'actionType');
		set('groupId', groupId, { includeEmpty: true });
		set('actionType', actionType);
	}

	// ---------- Custom Popup Interaction ----------
	if (event === 'customPopup.interaction') {
		const popupId = getParamSafe(this, 'additionalPopupInteraction.customPopupId');
		const interaction = getParamSafe(this, 'additionalPopupInteraction.interactionType');
		const userIdOptional = getParamSafe(this, 'additionalPopupInteraction.userId');
		set('popupId', popupId, { includeEmpty: true });
		set('interactionType', interaction);
		// nur mitsenden, wenn popupId gesetzt (wie gewünscht)
		if (popupId) set('userId', userIdOptional);
	}

	// ---------- Login New ----------
	if (event === 'login.new') {
		const lt = getParamSafe(this, 'loginType'); // Einzel-Option, keine Collection
		const userId = getParamSafe(this, 'additionalLoginNew.userId');
		set('loginType', lt, { includeEmpty: true });
		set('userId', userId);
	}

	// ---------- Course Progress Changed ----------
	if (event === 'courseProgress.changed') {
		// API erwartet "above" (integer)
		const thresholdRaw = this.getNodeParameter('threshold') as number;
		const above = Math.max(0, Math.floor(Number.isFinite(thresholdRaw) ? thresholdRaw : 0));
		set('above', above);

		// Optionaler Course-Filter aus Collection
		const courseId = getParamSafe(this, 'additionalCourseProgress.courseId');
		set('courseId', courseId);
	}

	// ---------- Exams ----------
	if (event === 'exam.completed' || event === 'exam.graded') {
		const courseId = getParamSafe(this, 'additionalFeedbackExam.courseId');
		set('courseId', courseId, { includeEmpty: true });
	}
	// ---------- Feedback (optional course) ----------
	if (event === 'feedback.created') {
		const courseId = getParamSafe(this, 'additionalFeedbackExam.courseId');
		set('courseId', courseId, { includeEmpty: true });
	}

	// ---------- New Access Request Course Created ----------
	if (event === 'accessRequest.created') {
		const courseId = getParamSafe(this, 'courseId');
		set('courseId', courseId);
	}

	// ---------- Lesson Completed (kaskadierend, alle optional) ----------
	if (event === 'lesson.completed') {
		const courseId = getParamSafe(this, 'additionalLessonCompleted.courseId');
		const moduleId = getParamSafe(this, 'additionalLessonCompleted.moduleId');
		const lessonId = getParamSafe(this, 'additionalLessonCompleted.lessonId');
		set('courseId', courseId, { includeEmpty: true });
		set('moduleId', moduleId, { includeEmpty: true });
		set('lessonId', lessonId, { includeEmpty: true });
	}

	// ---------- Submission Created (optional course) ----------
	if (event === 'submission.created') {
		const courseId = getParamSafe(this, 'additionalSubmission.courseId');
		set('courseId', courseId, { includeEmpty: true });
	}

	return { filter, hasFilter };
}

export class LearningSuiteTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LearningSuite Trigger',
		name: 'learningSuiteTrigger',
		icon: 'file:icon.svg',
		/*icon: 'fa:graduation-cap',*/
		group: ['trigger'],
		version: 1,
		// WICHTIG: KEIN polling:true -> sonst zeigt n8n immer das Polling-Panel
		description: 'Interact with LearningSuite API (powered by agentur-systeme.de)',
		subtitle: '={{$parameter["event"]}}',
		defaults: {
			name: 'LearningSuite Trigger',
			// @ts-expect-error -- some linters require this
			description: 'Interact with LearningSuite API (powered by agentur-systeme.de)',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'learningSuiteApi',
				required: true,
				// @ts-expect-error
				description: 'Uses LearningSuite API Key via header X-API-KEY',
			},
		],
		webhooks: [{ name: 'default', httpMethod: 'POST', responseMode: 'onReceived', isFullPath: true, path: '' }],
		properties: instantProperties,
	};

	methods = {
		...credentialMethods,
		loadOptions: {
			member_getMembers: loMember.member_getMembers,
			course_getCourses: loCourse.course_getCourses,
			community_getAreas: loCommunity.community_getAreas,
			community_getForums: loCommunity.community_getForums,
			group_getGroups: loGroup.group_getGroups,
			course_getModules: loCourse.course_getModules, // <— wichtig
			module_getModules: loModule.module_getModules,
			module_getLessons: loModule.module_getLessons, // <— wichtig
			module_getSections: loModule.module_getSections,
			// @ts-ignore
			module_getLessons: (loModule as any).module_getLessons,
			popup_getPopups: loPopup.popup_getPopups,
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const event = this.getNodeParameter('event', 0) as string;
				if (!INSTANT_EVENTS.has(event)) return true;

				const webhookData = this.getWorkflowStaticData('node');
				const storedId = webhookData.subscriptionId as string | undefined;
				if (!storedId) return false;

				const desiredHookUrl = this.getNodeWebhookUrl('default') as string;
				const { filter: desiredFilter, hasFilter } = buildDesiredFilter.call(this, event);

				try {
					const remote = await apiRequest.call(this, {
						method: 'GET',
						path: `/webhooks/subscription/${encodeURIComponent(storedId)}`,
					});

					const remoteType = (remote as any)?.type;
					const remoteUrl = (remote as any)?.url;
					const remoteFilter = ((remote as any)?.filter ?? {}) as IDataObject;

					const typeDiffers = remoteType !== event;
					const urlDiffers = remoteUrl !== desiredHookUrl;

					let filterDiffers = false;
					const keys = new Set([...Object.keys(remoteFilter || {}), ...Object.keys(desiredFilter || {})]);
					for (const k of keys) {
						if ((remoteFilter as any)?.[k] !== (desiredFilter as any)?.[k]) {
							filterDiffers = true;
							break;
						}
					}

					if (typeDiffers || urlDiffers || filterDiffers) {
						const body: IDataObject = { hookUrl: desiredHookUrl, type: event };
						if (hasFilter) body.filter = desiredFilter;

						await apiRequest.call(this, {
							method: 'PUT',
							path: `/webhooks/subscription/${encodeURIComponent(storedId)}`,
							body,
						});
					}

					return true;
				} catch (error: any) {
					if (error?.statusCode === 404 || error?.response?.statusCode === 404) {
						delete webhookData.subscriptionId;
						return false;
					}
					throw new NodeApiError(this.getNode(), error as JsonObject, {
						message: 'Failed to verify/update existing webhook subscription',
					});
				}
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const event = this.getNodeParameter('event', 0) as string;
				if (!INSTANT_EVENTS.has(event)) return true;

				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const body: IDataObject = { hookUrl: webhookUrl, type: event };

				const { filter, hasFilter } = buildDesiredFilter.call(this, event);
				if (hasFilter) body.filter = filter;

				try {
					const response = await apiRequest.call(this, {
						method: 'POST',
						path: '/webhooks/subscription',
						body,
					});
					const webhookData = this.getWorkflowStaticData('node');
					webhookData.subscriptionId = (response as any)?.id;
					return true;
				} catch (error) {
					throw new NodeApiError(this.getNode(), error as JsonObject, {
						message: 'Failed to create webhook subscription',
					});
				}
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const event = this.getNodeParameter('event', 0) as string;
				if (!INSTANT_EVENTS.has(event)) return true;

				const webhookData = this.getWorkflowStaticData('node');
				const id = webhookData.subscriptionId as string | undefined;
				if (!id) return true;

				try {
					await apiRequest.call(this, {
						method: 'DELETE',
						path: `/webhooks/subscription/${encodeURIComponent(id)}`,
					});
				} catch (error: any) {
					if (error?.statusCode !== 404 && error?.response?.statusCode !== 404) {
						delete webhookData.subscriptionId;
						throw new NodeApiError(this.getNode(), error as JsonObject, {
							message: 'Failed to delete webhook subscription',
						});
					}
				}

				delete webhookData.subscriptionId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData() as unknown;
		if (Array.isArray(body)) {
			// @ts-ignore
			return { workflowData: [this.helpers.returnJsonArray(body as IDataObject[])] };
		}
		if (body && typeof body === 'object') {
			// @ts-ignore
			return { workflowData: [this.helpers.returnJsonArray([body as IDataObject])] };
		}
		// @ts-ignore
		return { workflowData: [this.helpers.returnJsonArray([{ error: 'No JSON body' }])] };
	}
}