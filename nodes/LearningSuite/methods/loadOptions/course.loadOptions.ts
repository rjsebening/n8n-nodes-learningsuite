import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { fetchOptions, ensureArray } from './common';
import { lsRequest } from '../../shared';

function getFirstParam(thisArg: ILoadOptionsFunctions, paths: string[], itemIndex = 0): string {
	for (const p of paths) {
		try {
			const v = thisArg.getNodeParameter(p, itemIndex) as string;
			if (v) return String(v);
		} catch {}
	}
	return '';
}

export async function course_getCourses(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return fetchOptions.call(this, '/courses/published', undefined, ['name', 'title'], ['id', 'sid']);
}

export async function course_getModules(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const courseId = getFirstParam(this, [
		'courseId',
		'additionalLessonCompleted.courseId',
		'additionalAccessRequest.courseId',
		'additionalSubmission.courseId',
		'additionalCourseProgress.courseId',
		'additionalFeedbackExam.courseId',
	]);

	if (!courseId) return [];
	return fetchOptions.call(this, `/courses/${courseId}/modules`, undefined, ['title', 'name'], ['id', 'sid']);
}

/**
 * Lädt alle Sections eines Kurses. (Für andere Nodes/Use-Cases)
 */
export async function course_getSectionsInCourse(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const courseId = getFirstParam(this, [
		'courseId',
		'additionalLessonCompleted.courseId',
		'additionalAccessRequest.courseId',
		'additionalSubmission.courseId',
		'additionalCourseProgress.courseId',
		'additionalFeedbackExam.courseId',
	]);

	if (!courseId) return [];
	const modules = ensureArray(await lsRequest.call(this, 'GET', `/courses/${courseId}/modules`));
	const allSections: INodePropertyOptions[] = [];

	for (const m of modules) {
		if (!m?.id) continue;
		const sections = ensureArray(await lsRequest.call(this, 'GET', `/modules/${m.id}/sections`));
		for (const s of sections) {
			allSections.push({
				name: `${m.title ?? m.name ?? m.id} — ${s.title ?? s.name ?? s.id}`,
				value: String(s.id ?? s.sid ?? s.slug ?? s.title),
			});
		}
	}
	return allSections;
}
