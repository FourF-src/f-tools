import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import fund from './controller/etf';
const app = express();
app.use(bodyParser.json())

app.use('/api/etf', fund);
app.use(express.static(path.resolve(__dirname, '../dist')));
app.listen(9000)

console.log('api run at http://localhost:9000')