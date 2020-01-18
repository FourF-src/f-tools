import express from 'express';
import bodyParser from 'body-parser';
import fund from './controller/fund';
const app = express();
app.use(bodyParser.json())

app.use('/api/fund', fund);

app.listen(8001)
