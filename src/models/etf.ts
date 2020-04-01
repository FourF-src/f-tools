import { EnhancedModel as Model, Action } from 'dva';
import { createAction } from '@/util/createaction';
import { etfBasic, etfInfo, etfList } from '@/services/api';
interface Item {
  code: string;
  name: string;
}

interface Info{
  capital: number
  managementFee: number
  custodianFee: number
  marketingfee: number
}

interface HisData {
  date: string;
  close: number;
  netValue: number;
  premium: number;
}

interface State {
  list: Partial<Item>[];
  type: 'basic'|'info',
  data: Array<HisData>,
  info?: Info
}
export const namespace = 'etf';
export const actions = {
  set: (state: Partial<State>) => createAction(`${namespace}/set`, state),
  getBasic: (code: string, type:'1yrs'|'3yrs'|'5yrs') => createAction(`${namespace}/getBasic`, {code, type}),
  getInfo: (code: string) => createAction(`${namespace}/getInfo`, {code}),
  getList: () => createAction(`${namespace}/getList`),
};
const mm: Model<State> = {
  namespace,
  state: {
    type: 'basic',
    list: [],
    data: [],
    info: void 0,
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
    *getList({ payload }, { call, put }){
      const res = yield call(etfList);
      if (res.result){
        yield put(actions.set({list: res.result}));
      }
    },
    *getBasic({ payload }, { call, put }) {
      yield put(actions.set({data: []}));
      const res = yield call(etfBasic, payload.code, payload.type);
      if (res.result){
        yield put(actions.set({data: res.result}));
      }
    },
    *getInfo({ payload }, { call, put }) {
      const res = yield call(etfInfo, payload.code);
      if (res.result){
        yield put(actions.set({info: res.result}));
      }
    }
  },
}

export default mm;