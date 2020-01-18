import {AnyAction} from 'redux';
import {EnhancedModel} from 'dva';
export function createAction (type:string, payload?:any):AnyAction{
    return {
        type, payload
    }
}

