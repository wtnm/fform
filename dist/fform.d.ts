/** @jsx h */
import { Component } from 'react';
import { MergeStateOptionsArgument } from "react-ts-utils";
import { FFormStateAPI, fformCores, formReducer } from './api';
declare class FForm extends Component<FFormProps> {
    static params: string[];
    private _unsubscribe;
    private _savedState;
    private _savedValue;
    protected _root: any;
    protected _form: any;
    protected _methods: anyObject;
    api: any;
    elements: any;
    parent: any;
    wrapFns: typeof bindProcessorToThis;
    constructor(props: FFormProps, ...args: any[]);
    private _coreFromParams;
    private _initState;
    private _updateMethods;
    private _setRootRef;
    private _setFormRef;
    private _updateValues;
    private _handleStateUpdate;
    private _extendEvent;
    private _submit;
    shouldComponentUpdate(nextProps: FFormProps): boolean;
    componentWillUnmount(): void;
    getRef(path: Path | string): any;
    static _getPath(): string;
    getDataObject(branch: any, ffield: FField): any;
    getValue(branch: any, ffield: FField): any;
    getBranch(path: string): any;
    reset(event?: any): void;
    submit(): void;
    render(): JSX.Element;
}
declare class FRefsGeneric extends Component<any, any> {
    $refs: any;
    constructor(props: any, context: any);
    getRef(path: Path): any;
    protected _setRef(name: string): (v: any) => any;
    protected _refProcess(defaultName: string, $reactRef: any): any;
}
declare class FField extends FRefsGeneric {
    private _mappedData;
    private _builderData;
    private _rebuild;
    private _cached?;
    private _cachedTimeout?;
    private _blocks;
    private _widgets;
    private _components;
    private _maps;
    private _$_parse;
    _forceLiveUpd: boolean;
    _forceUpd: boolean;
    get: Function | null;
    _layout: FFLayoutGeneric<jsFFCustomizeType>;
    $branch: any;
    schemaPart: jsJsonSchema;
    liveValidate: boolean;
    liveUpdate: boolean;
    path: any;
    api: any;
    pFForm: any;
    stateApi: any;
    wrapFns: typeof bindProcessorToThis;
    constructor(props: any, context: any);
    getRef(path: Path | string): any;
    _resolver(value: any): any;
    _addErrPath(e: any): any;
    _updateStateApi(stateApi: any): void;
    _updateCachedValue(update?: boolean): void;
    _cacheValue(path: any, value: any, fn?: string, opts?: any): boolean | undefined;
    _build(): void;
    _setMappedData(prevData: any, nextData: any, updateStage: boolean | 'build'): boolean;
    getData(branch?: any): any;
    shouldComponentUpdate(nextProps: any, nextState: any): boolean;
    render(): false | import("react").DetailedReactHTMLElement<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> | null;
}
declare function bindProcessorToThis(val: any, opts?: anyObject): any;
declare function extractMaps(obj: any, skip?: string[]): {
    $_maps: any;
    rest: any;
};
declare function normalizeMaps($_maps: any, prePath?: string): {
    data: NormalizedDataProcessor[];
    every: NormalizedDataProcessor[];
    build: NormalizedDataProcessor[];
};
declare function updateProps(mappedData: any, prevData: any, nextData: any, ...iterMaps: Array<NormalizedDataProcessor[] | false>): StateType;
declare const getExten: (enumExten: any, value: any) => import("react-ts-utils").anyObject;
declare function comparePropsFn(prevProps: anyObject, nextProps: anyObject, opts?: {
    equal?: boolean;
}): (key: string) => boolean;
declare function classNames(...styles: any[]): string;
declare let elementsBase: elementsType & {
    extend: (elements: any[], opts?: MergeStateOptionsArgument) => any;
};
export { elementsBase as elements, formReducer, FForm, FField, FFormStateAPI, fformCores };
export { extractMaps, normalizeMaps, updateProps, classNames, comparePropsFn, getExten };
