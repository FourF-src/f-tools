import express from 'express';
import bodyParser from 'body-parser';
import fund from './controller/etf';
const app = express();
app.use(bodyParser.json())

app.use('/api/etf', fund);

app.listen(8001)
