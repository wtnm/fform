declare const SymData: any;
declare const SymDataMap: any;
declare const SymReset: any;
declare const SymClear: any;
declare const SymDelete: undefined;
declare const types: any;
declare function branchKeys(branch: StateType): string[];
declare function oneOfFromState(state: StateType | Function): (path: Path) => oneOfStructureType;
declare function getSchemaPart(schema: jsJsonSchema, path: Path, value_or_getOneOf: ((path: Path) => oneOfStructureType) | any, opts?: any): jsJsonSchema;
declare const arrayStart: (...args: any[]) => any;
declare function getUniqKey(): string;
declare function isSelfManaged(state: StateType, ...paths: any[]): boolean;
declare function isSchemaSelfManaged(schemaPart: jsJsonSchema, type: string): any;
declare function rehydrateState(state: any, UPDATABLE: PROCEDURE_UPDATABLE_Type): StateType;
declare function updateState(dispatch: any): any;
declare function initState(UPDATABLE: PROCEDURE_UPDATABLE_Type): any;
declare function setUPDATABLE(UPDATABLE: PROCEDURE_UPDATABLE_Type, update: any, replace: any, ...paths: any[]): PROCEDURE_UPDATABLE_Type;
declare function mergeUPD_PROC(state: StateType, UPDATABLE: PROCEDURE_UPDATABLE_Type): StateType;
declare function updatePROC(state: StateType, UPDATABLE: PROCEDURE_UPDATABLE_Type, item: NormalizedUpdateType | StateApiUpdateType | null): StateType;
declare function getFromState(state: any, ...paths: Array<symbol | string | Path>): any;
declare const makeNUpdate: (path: Path, keyPath: Path, value?: any, replace?: any, rest?: any) => NormalizedUpdateType;
declare function string2NUpdate(path: string | Path, base?: string | Path, rest?: any): NormalizedUpdateType;
declare function normalizeUpdate(update: StateApiUpdateType, state: StateType): NormalizedUpdateType[];
declare function multiplePath(path: Path, strReplace?: {
    [key: string]: any;
}): any;
declare function relativePath(base: Path, destination: Path): any;
declare function setIfNotDeeper(state: any, value: any, ...paths: any[]): any;
declare function isNPath(path: any): boolean;
declare function normalizePath(path: string | Path, base?: string | Path): Path;
declare function path2string(path: any): string;
declare function string2path(path: string): Path;
declare const isElemRef: (val: any) => boolean;
declare function object2PathValues(vals: {
    [key: string]: any;
}, options?: object2PathValuesOptions, track?: Path): PathValueType[];
declare const objMap: (object: any, fn: (item: any, track: string[]) => any, track?: string[]) => {};
declare const isMapFn: (arg: any) => any;
declare function normalizeArgs(args: any, wrapFn?: any): {
    dataRequest: boolean;
    args: any;
    norm: boolean;
};
declare function normalizeFn(fn: any, opts?: any): {
    $: Function;
    args: any;
    [key: string]: any;
};
declare function processProp(nextData: any, arg: any): any;
declare function processFn(map: any, ...rest: any[]): any;
declare function makeSlice(...pathValues: any[]): StateType;
export { object2PathValues, string2path, relativePath, getSchemaPart, oneOfFromState, path2string, normalizePath, branchKeys, getFromState, arrayStart, mergeUPD_PROC, isSelfManaged, isSchemaSelfManaged, normalizeUpdate, setIfNotDeeper, objMap, setUPDATABLE, isNPath, multiplePath, normalizeArgs, normalizeFn, processFn, isMapFn, types, updateState, initState, rehydrateState, processProp, isElemRef };
export { SymData, SymReset, SymClear, SymDelete, SymDataMap };
export { makeNUpdate, updatePROC, string2NUpdate, getUniqKey, makeSlice };
