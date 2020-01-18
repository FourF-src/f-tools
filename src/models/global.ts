import {EnhancedModel as Model, Action} from 'dva';

import {createAction} from '@/util/createaction';
interface State {
}
export const namespace = 'global';
export const actions = {
  set: (state:Partial<State>) => createAction('global/set', state),

};
const mm:Model<State> = {
  namespace,
  state: {
  },
  subscriptions: {
    setup({ dispatch, history }) {

    },
  },
  reducers: {
    set(state, {payload}:Action) {
      return {...state, ...payload}
    },
  },
  effects: {
  },
}

export default mm;