import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { fetchOptions } from './common';

function getFirstParam(thisArg: ILoadOptionsFunctions, paths: string[], itemIndex = 0): string {
	for (const p of paths) {
		try {
			const v = thisArg.getNodeParameter(p, itemIndex) as string;
			if (v) return String(v);
		} catch {}
	}
	return '';
}

export async function module_getAllModules(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return fetchOptions.call(this, '/modules', undefined, ['title', 'name'], ['id', 'sid']);
}

export async function module_getModules(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const courseId = getFirstParam(this, [
		'courseId',
		'additionalLessonCompleted.courseId',
		'additionalAccessRequest.courseId',
		'additionalSubmission.courseId',
		'additionalCourseProgress.courseId',
		'additionalFeedbackExam.courseId',
	]);

	if (courseId) {
		return fetchOptions.call(this, `/courses/${courseId}/modules`, undefined, ['title', 'name'], ['id', 'sid']);
	}

	// Fallback (falls API globales /modules unterstützt)
	try {
		return fetchOptions.call(this, '/modules', undefined, ['title', 'name'], ['id', 'sid']);
	} catch {
		return [];
	}
}

export async function module_getSections(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const moduleId = getFirstParam(this, ['additionalLessonCompleted.moduleId', 'moduleId']);
	if (!moduleId) return [];
	return fetchOptions.call(this, `/modules/${moduleId}/sections`, undefined, ['title', 'name'], ['id', 'sid']);
}

export async function module_getLessons(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const moduleId = getFirstParam(this, ['additionalLessonCompleted.moduleId', 'moduleId']);
	if (!moduleId) return [];
	return fetchOptions.call(this, `/modules/${moduleId}/lessons`, undefined, ['title', 'name'], ['id', 'sid']);
}
