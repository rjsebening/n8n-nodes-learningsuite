// nodes/LearningSuite/shared/webhook.utils.ts
import type { IDataObject } from 'n8n-workflow';

export const toFilter = (v: unknown): IDataObject => (v && typeof v === 'object' ? (v as IDataObject) : {});
