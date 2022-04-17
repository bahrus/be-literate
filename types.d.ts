import {BeDecoratedProps} from 'be-decorated/be-decorated.js';

export interface BeLiterateVirtualProps{
    fileContents: any[];
}

export interface BeLiterateProps extends BeLiterateVirtualProps{
    proxy: HTMLInputElement & BeLiterateVirtualProps;
}

export interface BeLiterateActions {
    intro(proxy: HTMLInputElement & BeLiterateVirtualProps, target: HTMLInputElement, beDecorProps: BeDecoratedProps): void;
    finale(proxy: HTMLInputElement & BeLiterateVirtualProps, target: HTMLInputElement, beDecorProps: BeDecoratedProps): void;
}