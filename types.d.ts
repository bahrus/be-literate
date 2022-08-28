import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface BeLiterateEndUserProps{
    readVerb: 'readAsText' | 'readAsDataURL' | 'readAsArrayBuffer' | 'readAsBinaryString';
}

export interface BeLiterateVirtualProps extends BeLiterateEndUserProps, MinimalProxy{
    fileContents: any[];
    
}

export interface BeLiterateProps extends BeLiterateVirtualProps{
    proxy: HTMLInputElement & BeLiterateVirtualProps;
}

export interface BeLiterateActions {
    intro(proxy: HTMLInputElement & BeLiterateVirtualProps, target: HTMLInputElement, beDecorProps: BeDecoratedProps): void;
    finale(proxy: HTMLInputElement & BeLiterateVirtualProps, target: HTMLInputElement, beDecorProps: BeDecoratedProps): void;
}