import { EnhancedModel as Model, Action } from 'dva';
import { createAction } from '@/util/createaction';
import { hs300, stockProfit, kdata } from '@/services/api';
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

interface KData {
  date: string;
  code: string;
  open: string;
  high: string;
  low: string;
  close: string;
  preclose: string;
  lowPcg?: number;
}


interface State {
  type: 'profit';
  profit: Array<ProfitItem>;
  kdata: Array<KData>;
  hs300: Array<{
    code: string,
    code_name: string;
  }>
}
export const namespace = 'stock';
export const actions = {
  set: (state: Partial<State>) => createAction(`${namespace}/set`, state),
  getProfit: (code:string) => createAction(`${namespace}/getProfit`, {code}),
  getKdata: (code:string, start:number, end:number) => createAction(`${namespace}/getKdata`, {code, start, end}),
  getHS300: () => createAction(`${namespace}/getHS300`),
};
const mm: Model<State> = {
  namespace,
  state: {
    type: 'profit',
    profit: [],
    kdata: [],
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
    *getKdata({ payload }, { call, put }) {
      yield put(actions.set({kdata: []}));
      const start = new Date(payload.start);
      const end = new Date(payload.end);
      const res = yield call(kdata, payload.code, `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`, `${end.getFullYear()}-${end.getMonth()}-${end.getDate()}`);
      if (res.result){
        yield put(actions.set({kdata: res.result}));
      }
    },
  },
}

export default mm;