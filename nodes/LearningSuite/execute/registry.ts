// execute/registry.ts
import type { HandlersRegistry } from '../exec.types';
import { apiCallHandlers } from './apiCall.handlers';
import { bundleHandlers } from './bundle.handlers';
import { communityHandlers } from './community.handlers';
import { courseHandlers } from './course.handlers';
import { groupHandlers } from './group.handlers';
import { hubHandlers } from './hub.handlers';
import { memberHandlers } from './member.handlers';
import { moduleHandlers } from './module.handlers';
import { popupHandlers } from './popup.handlers';
import { roleHandlers } from './role.handlers';
import { webhookHandlers } from './webhook.handlers';
import { teamMemberHandlers } from './teamMember.handlers';
import { userHandlers } from './user.handlers';

export const registry: HandlersRegistry = {
	apiCall: apiCallHandlers,
	bundle: bundleHandlers,
	community: communityHandlers,
	course: courseHandlers,
	group: groupHandlers,
	hub: hubHandlers,
	member: memberHandlers,
	module: moduleHandlers,
	popup: popupHandlers,
	teamMember: teamMemberHandlers,
	user: userHandlers,
	role: roleHandlers,
	webhook: webhookHandlers,
};
