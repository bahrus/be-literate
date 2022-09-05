import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps{
    readVerb: 'readAsText' | 'readAsDataURL' | 'readAsArrayBuffer' | 'readAsBinaryString';
}

export interface VirtualProps extends EndUserProps, MinimalProxy<HTMLInputElement>{
    fileContents: any[];
}

export type Proxy = HTMLInputElement & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;


export interface Actions {
    intro(proxy: Proxy, target: HTMLInputElement, beDecorProps: BeDecoratedProps): void;
    finale(proxy: Proxy, target: HTMLInputElement, beDecorProps: BeDecoratedProps): void;
}