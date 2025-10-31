import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { fetchOptions } from './common';
import { getScopedParam } from '../../shared/getScopedParam';

export async function module_getAllModules(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return fetchOptions.call(this, '/modules', undefined, ['title', 'name'], ['id', 'sid']);
}

export async function module_getModules(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const courseId = getScopedParam.call(this, 'courseId');
	if (!courseId) return [];

	return fetchOptions.call(this, `/courses/${courseId}/modules`, undefined, ['title', 'name'], ['id', 'sid']);
}

export async function module_getSections(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const moduleId = getScopedParam.call(this, 'moduleId');
	if (!moduleId) return [];

	return fetchOptions.call(this, `/modules/${moduleId}/sections`, undefined, ['title', 'name'], ['id', 'sid']);
}

export async function module_getLessons(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const moduleId = getScopedParam.call(this, 'moduleId');
	if (!moduleId) return [];

	return fetchOptions.call(this, `/modules/${moduleId}/lessons`, undefined, ['title', 'name'], ['id', 'sid']);
}
