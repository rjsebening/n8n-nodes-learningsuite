import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { fetchOptions, ensureArray } from './common';
import { lsRequest } from '../../shared';
import { getScopedParam } from '../../shared/getScopedParam';

export async function course_getCourses(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return fetchOptions.call(this, '/courses/published', undefined, ['name', 'title'], ['id', 'sid']);
}

export async function course_getModules(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const courseId = getScopedParam.call(this, 'courseId');
	if (!courseId) return [];

	return fetchOptions.call(this, `/courses/${courseId}/modules`, undefined, ['title', 'name'], ['id', 'sid']);
}

export async function course_getSectionsInCourse(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const courseId = getScopedParam.call(this, 'courseId');
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
