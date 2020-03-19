/** @jsx h */
import { Component } from 'react';
import { FField } from "./fform";
declare class FViewer extends Component<FViewerProps> {
    protected _root: any;
    protected _form: any;
    protected _state: any;
    protected _customData: {
        [key: string]: anyObject;
    };
    protected _customReplace: any;
    api: any;
    parent: any;
    schema: any;
    static readonly paramsBase: any;
    get elements(): any;
    constructor(props: FViewerProps, ...args: any[]);
    private _setApi;
    private _normalizeCustom;
    private _setRootRef;
    private _setFormRef;
    static _makeStateDataObj(schemaPart: any, type: string, newVal: any): any;
    private _value2state;
    shouldComponentUpdate(nextProps: FViewerProps): boolean;
    getRef(path: Path | string): any;
    static _getPath(): string;
    getDataObject(branch: any, ffield: FField): any;
    getValue(branch: any, ffield: FField): any;
    getBranch(path: string): any;
    getSchemaPart(path: string | Path): any;
    render(): JSX.Element;
}
export { FViewer };
