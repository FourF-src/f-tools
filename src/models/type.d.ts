import GlobalModel, {namespace as globalName} from './global';
import ETFModel, {namespace as ETFName} from './etf';
import StockModel, {namespace as StockName} from './stock';

type StoreAppState = {
    [globalName]: typeof GlobalModel.state;
    [ETFName]: typeof ETFModel.state;
    [StockName]: typeof StockModel.state;
}
type models = keyof StoreAppState;
export interface AppState extends StoreAppState{
    loading: {
        global: boolean;
        models: Record<models, boolean>;
    }
}

