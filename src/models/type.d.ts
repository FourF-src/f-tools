import GlobalModel, {namespace as globalName} from './global';
import ETFModel, {namespace as ETFName} from './etf';

export type AppState = {
    [globalName]: typeof GlobalModel.state;
    [ETFName]: typeof ETFModel.state;
}

