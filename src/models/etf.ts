import { EnhancedModel as Model, Action } from 'dva';
import { createAction } from '@/util/createaction';
import { fundNetValue } from '@/services/api';
interface Item {
  code: string;
}

interface State {
  current?: Item;
  list: Partial<Item>[];
  type: 'netValue',
  data?: Array<
    {
      date: string;
      etf: number;
      fund: number;
      ratio: number;
    }
  >
}
export const namespace = 'etf';
export const actions = {
  set: (state: Partial<State>) => createAction(`${namespace}/set`, state),
  getNetValue: (code: string) => createAction(`${namespace}/getNetValue`, code),
};
const mm: Model<State> = {
  namespace,
  state: {
    type: 'netValue',
    current: void 0,
    list: [],
    data: void 0
  },
  subscriptions: {
    setup({ dispatch, history }) {

    },
  },
  reducers: {
    set(state, { payload }: Action) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *getNetValue({ payload }, { call, put }) {
      yield put(actions.set({type: 'netValue'}));
      const res = yield call(fundNetValue, payload);
      if (res.result){
        yield put(actions.set({data: res.result}));
      }
    }
  },
}

export default mm;