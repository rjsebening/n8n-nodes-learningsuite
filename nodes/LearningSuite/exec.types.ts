import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

/** Einheitlicher Funktions-Typ für alle Execute-Handler. */
export type ExecuteHandler = (ctx: IExecuteFunctions, itemIndex: number) => Promise<IDataObject | IDataObject[]>;

/** Registry-Typ: resource -> operation -> handler */
export type HandlersRegistry = Record<string, Record<string, ExecuteHandler>>;
