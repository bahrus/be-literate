import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';

export interface EndUserProps extends IBE<HTMLInputElement>{
    readVerb: 'readAsText' | 'readAsDataURL' | 'readAsArrayBuffer' | 'readAsBinaryString';
}

export interface AllProps extends EndUserProps{
    fileContents: any[];
}


export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];

export interface Actions {
    //intro(proxy: Proxy, target: HTMLInputElement, beDecorProps: BeDecoratedProps): void;
    //finale(proxy: Proxy, target: HTMLInputElement, beDecorProps: BeDecoratedProps): void;
}