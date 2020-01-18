import {AnyAction} from 'redux';
import { Model } from 'dva';
import {FC as ReactFC} from 'react';
declare module '*.css';
declare module "*.png";
export interface Action extends AnyAction {
    type: string
}



declare module 'umi' {
    export interface PropsRoute {
        location: {
            pathname: string;
            search: string;
            hash: string;
            query: Record<string, string>;
            state: any;
            key: string;
        }
    }
}

declare module 'dva' {
    
    export interface Action extends AnyAction {
        type: string
    }
    export interface EnhancedModel<T> extends Model{
        state: T;
    }
}