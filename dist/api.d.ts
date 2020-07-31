/** Creates a api that contains data and api for changing it */
declare class FFormStateManager {
    private _isDispatching;
    private _currentState;
    private _reducer;
    private _validator;
    private _unsubscribe;
    private _listeners;
    JSONValidator: any;
    UPDATABLE: PROCEDURE_UPDATABLE_Type;
    props: FFormApiProps;
    schema: jsJsonSchema;
    dispatch: any;
    name?: string;
    constructor(props: FFormApiProps);
    private _dispatch;
    _setState(state: any): void;
    _getState(): any;
    private _setStoreState;
    private _getStoreState;
    private _handleChange;
    addListener(fn: (state: StateType) => void): any;
    delListener(fn?: any): void;
}
declare class FFormStateAPI extends FFormStateManager {
    private _noExec;
    private _resultPromises;
    private _newState;
    private _updates;
    private _validation;
    private _defferedTimerId;
    getState: () => any;
    constructor(props: FFormApiProps);
    wrapper(self?: any): any;
    private _clearActions;
    private _execBatch;
    private _setExecution;
    private _promise;
    noExec: () => void;
    execute: (opts?: APIOptsType) => any;
    setState: (state: StateType, opts?: APIOptsType) => any;
    getActive: () => any;
    validate: (path?: string | boolean | Path, opts?: APIOptsType) => any;
    get: (...paths: any) => any;
    set: (path: string | Path | null, value: any, opts?: APIOptsType & {
        replace?: any;
        setOneOf?: number | undefined;
        macros?: string | undefined;
    }) => any;
    getValue: (opts?: {
        path?: string | Path | undefined;
        initial?: boolean | undefined;
    }) => any;
    setValue: (value: any, opts?: APIOptsType & {
        path?: string | Path | undefined;
        replace?: any;
        setOneOf?: number | undefined;
        initial?: boolean | undefined;
    }) => any;
    getDefaultValue: () => any;
    switch: (path: string | Path | null, value: any, opts?: APIOptsType & {
        replace?: any;
        setOneOf?: number | undefined;
        macros?: string | undefined;
    }) => any;
    setMessages: (value: anyObject | null, opts?: APIOptsType & {
        priority?: number | undefined;
        group?: number | undefined;
        path?: string | Path | undefined;
        props?: any;
    }) => void;
    reset: (opts?: APIOptsType & {
        path?: string | Path | undefined;
        status?: string | undefined;
        value?: any;
    }) => void;
    clear: (opts?: APIOptsType & {
        path?: string | Path | undefined;
    }) => any;
    arrayAdd: (path: string | Path, value?: number | any[], opts?: APIOptsType) => any;
    arrayItemOps: (path: string | Path, value: "del" | "first" | "last" | "up" | "down" | "move" | "shift", opts?: APIOptsType & {
        value?: number | undefined;
    }) => any;
    setHidden: (path: string | Path, value?: boolean, opts?: APIOptsType) => any;
    showOnly: (path: string | Path, opts?: APIOptsType) => any;
    getSchemaPart: (path?: string | Path) => jsJsonSchema;
}
declare const anSetState = "FFROM_SET_STATE";
declare const compileSchema: (schema: any, elements: any) => any;
export { anSetState, FFormStateAPI, compileSchema };
