import GlobalModel, {namespace as globalName} from './global';
import ETFModel, {namespace as ETFName} from './etf';


type StoreAppState = {
    [globalName]: typeof GlobalModel.state;
    [ETFName]: typeof ETFModel.state;
}
type models = keyof StoreAppState;
export interface AppState extends StoreAppState{
    loading: {
        global: boolean;
        models: Record<models, boolean>;
    }
}

