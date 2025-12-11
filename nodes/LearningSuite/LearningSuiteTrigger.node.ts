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
import { toIdArray } from './shared/parsing';

// methods - loadOptions
import * as loBundle from './methods/loadOptions/bundle.loadOptions';
import * as loCommunity from './methods/loadOptions/community.loadOptions';
import * as loCourse from './methods/loadOptions/course.loadOptions';
import * as loGroup from './methods/loadOptions/group.loadOptions';
import * as loHub from './methods/loadOptions/hub.loadOptions';
import * as loMember from './methods/loadOptions/member.loadOptions';
import * as loModule from './methods/loadOptions/module.loadOptions';
import * as loPopup from './methods/loadOptions/popup.loadOptions';
import * as loRole from './methods/loadOptions/role.loadOptions';
import * as loWebhook from './methods/loadOptions/webhook.loadOptions';
import * as loTeamMember from './methods/loadOptions/teamMember.loadOptions';

const INSTANT_EVENTS = new Set<string>([
	'accessRequest.created',
	'communityPost.created',
	'communityPost.commented',
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
	'course.updated',
]);

function buildDesiredFilter(this: IHookFunctions, event: string): { filter: IDataObject; hasFilter: boolean } {
	const filter: IDataObject = {};

	const getCol = (path: string): IDataObject => {
		try {
			const v = this.getNodeParameter(path) as IDataObject | undefined;
			return v && typeof v === 'object' ? v : {};
		} catch {
			return {};
		}
	};

	const getStr = (path: string): string => {
		try {
			const v = this.getNodeParameter(path) as string | undefined;
			return (v ?? '').toString().trim();
		} catch {
			return '';
		}
	};

	const getNum = (path: string, fallback = 0): number => {
		try {
			const v = this.getNodeParameter(path) as number | undefined;
			return Number.isFinite(v as number) ? (v as number) : fallback;
		} catch {
			return fallback;
		}
	};

	switch (event) {
		// ---------------- Community
		case 'communityPost.commented': {
			const col = getCol('additionalCommunityPostCommented');

			if (col?.areaId) filter.areaId = String(col.areaId);
			if (col?.forumId) filter.forumId = String(col.forumId);

			const ids = toIdArray(col?.mentionedUserIds ?? []);
			if (ids.length) filter.mentionedUserIds = ids;

			break;
		}

		case 'communityPost.created': {
			const col = getCol('additionalCommunityPostCreated');
			if (col?.areaId) filter.areaId = String(col.areaId);
			if (col?.forumId) filter.forumId = String(col.forumId);
			if (col?.publishStatus && col.publishStatus !== 'both') {
				filter.published = col.publishStatus === 'published'; // boolean
			}
			break;
		}

		case 'communityPost.moderated': {
			const col = getCol('additionalCommunityPostModerated');
			if (col?.areaId) filter.areaId = String(col.areaId);
			if (col?.forumId) filter.forumId = String(col.forumId);
			if (col?.approved && col.approved !== 'both') {
				filter.approved = col.approved === 'approved'; // boolean
			}
			break;
		}

		// ---------------- Login
		case 'login.new': {
			const col = getCol('additionalLoginNew') as { loginType?: string; userRoleId?: string };
			if (col?.loginType) {
				filter.loginType = String(col.loginType);
			}
			if (col?.userRoleId) {
				filter.userRoleId = String(col.userRoleId);
			}
			break;
		}

		// ---------------- Custom Popup
		case 'customPopup.interaction': {
			const col = getCol('additionalPopupInteraction') as {
				customPopupId?: string;
				interactionType?: string;
			};

			if (col?.customPopupId) {
				filter.customPopupId = String(col.customPopupId);
			}
			if (col?.interactionType) {
				filter.interactionType = String(col.interactionType);
			}

			break;
		}

		// ---------------- Progress
		case 'courseProgress.changed': {
			// API: threshold + optional courseInstanceId
			const aboveRaw = getNum('threshold', 0);
			filter.above = Math.max(0, Math.floor(aboveRaw));
			const col = getCol('additionalCourseProgress');
			if (col.courseId) filter.courseInstanceId = String(col.courseId);
			break;
		}

		// ---------------- Exams
		case 'exam.completed':
		case 'exam.graded': {
			const col = getCol('additionalExamOptions') as {
				courseId?: string;
				examModuleId?: string;
			};

			if (col?.courseId) {
				filter.courseInstanceId = String(col.courseId);
			}
			if (col?.examModuleId) {
				filter.examModuleId = String(col.examModuleId);
			}
			break;
		}

		// course.updated
		case 'course.updated': {
			const col = getCol('additionalCourseOptions') as {
				courseId?: string;
			};

			if (col?.courseId) {
				filter.courseInstanceId = String(col.courseId);
			}
			break;
		}

		// feedback.created
		case 'feedback.created': {
			const col = getCol('additionalFeedbackOptions') as {
				courseId?: string;
			};

			if (col?.courseId) {
				filter.courseInstanceId = String(col.courseId);
			}
			break;
		}

		// ---------------- Access Request (required in UI)
		case 'accessRequest.created': {
			const courseId = getStr('courseId');
			if (courseId) filter.courseInstanceId = courseId;
			break;
		}

		// ---------------- Group Access
		case 'group.userAccessChanged': {
			const col = getCol('additionalGroupAccess');
			const actionType = getStr('actionType');
			if (actionType) filter.actionType = actionType; // 'added' | 'removed'
			if (col.groupId) filter.groupId = String(col.groupId);
			break;
		}

		// ---------------- Lesson Completed (kaskadiert)
		case 'lesson.completed': {
			const col = getCol('additionalLessonCompleted');
			if (col.courseId) filter.courseInstanceId = String(col.courseId);
			if (col.moduleId) filter.moduleId = String(col.moduleId);
			if (col.lessonId) filter.lessonId = String(col.lessonId);
			break;
		}

		// ---------------- Submission (optional course)
		case 'submission.created': {
			const col = getCol('additionalSubmission');
			if (col.courseId) filter.courseInstanceId = String(col.courseId);
			break;
		}
		default:
			break;
	}
	return { filter, hasFilter: true };
}

export class LearningSuiteTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LearningSuite Trigger',
		name: 'learningSuiteTrigger',
		icon: {
			light: 'file:./icons/icon-light.svg',
			dark: 'file:./icons/icon-dark.svg',
		},
		group: ['trigger'],
		version: 1,
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
		loadOptions: {
			...loBundle,
			...loCommunity,
			...loCourse,
			...loGroup,
			...loHub,
			...loMember,
			...loModule,
			...loPopup,
			...loRole,
			...loTeamMember,
			...loWebhook,
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const event = this.getNodeParameter('event') as string;
				if (!INSTANT_EVENTS.has(event)) return true;

				const webhookData = this.getWorkflowStaticData('node');
				const storedId = webhookData.subscriptionId as string | undefined;
				if (!storedId) return false;

				const desiredHookUrl = this.getNodeWebhookUrl('default') as string;

				const { filter: desiredFilterRaw } = buildDesiredFilter.call(this, event);
				const desiredFilter =
					desiredFilterRaw && typeof desiredFilterRaw === 'object' ? (desiredFilterRaw as IDataObject) : {};

				try {
					const remote = await apiRequest.call(this, {
						method: 'GET',
						path: `/webhooks/subscription/${encodeURIComponent(storedId)}`,
					});

					const remoteType = (remote as any)?.type as string | undefined;
					const remoteUrl = (remote as any)?.url as string | undefined;
					const remoteFilter = ((remote as any)?.filter ?? {}) as IDataObject;

					const typeDiffers = remoteType !== event;
					const urlDiffers = remoteUrl !== desiredHookUrl;

					let filterDiffers = false;
					const keys = new Set<string>([...Object.keys(remoteFilter || {}), ...Object.keys(desiredFilter || {})]);
					for (const k of keys) {
						const a = (remoteFilter as any)?.[k];
						const b = (desiredFilter as any)?.[k];
						if (a !== b) {
							filterDiffers = true;
							break;
						}
					}

					if (typeDiffers || urlDiffers || filterDiffers) {
						const body: IDataObject = {
							hookUrl: desiredHookUrl,
							type: event,
							filter: desiredFilter,
						};

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
				const event = this.getNodeParameter('event') as string;
				if (!INSTANT_EVENTS.has(event)) return true;

				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const { filter: rawFilter } = buildDesiredFilter.call(this, event);
				const filter = rawFilter && typeof rawFilter === 'object' ? (rawFilter as IDataObject) : {};

				const body: IDataObject = {
					hookUrl: webhookUrl,
					type: event,
					filter,
				};

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
				const event = this.getNodeParameter('event') as string;
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
