import { EnhancedModel as Model, Action } from 'dva';
import { createAction } from '@/util/createaction';
import { hs300, stockProfit, etfList } from '@/services/api';
interface ProfitItem {
  MBRevenue:  string;
  code:  string;
  epsTTM:  string;
  gpMargin:  string;
  liqaShare:  string;
  netProfit:  string;
  npMargin:  string;
  pubDate:  string;
  roeAvg:  string;
  statDate:  string;
  totalShare: string;
  timestamp: string;
}


interface State {
  type: 'profit';
  profit: Array<ProfitItem>;
  hs300: Array<{
    code: string,
    code_name: string;
  }>
}
export const namespace = 'stock';
export const actions = {
  set: (state: Partial<State>) => createAction(`${namespace}/set`, state),
  getProfit: () => createAction(`${namespace}/getProfit`),
  getHS300: () => createAction(`${namespace}/getHS300`),
};
const mm: Model<State> = {
  namespace,
  state: {
    type: 'profit',
    profit: [],
    hs300: []
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
    *getHS300({ payload }, { call, put }){
      const res = yield call(hs300);
      if (res.result){
        yield put(actions.set({hs300: res.result}));
      }
    },
    *getProfit({ payload }, { call, put }) {
      yield put(actions.set({profit: []}));
      const res = yield call(stockProfit, payload.code);
      if (res.result){
        yield put(actions.set({profit: res.result}));
      }
    },
  },
}

export default mm;