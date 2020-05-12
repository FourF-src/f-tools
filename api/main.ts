import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import fund from './controller/etf';
import stock from './controller/stock';

const app = express();
app.use(bodyParser.json())

app.use('/api/etf', fund);
app.use('/api/stock', stock);

const serveStatic = express.static(path.resolve(__dirname, '../dist'));
app.use(serveStatic);

// fallback
// All GET request handled by INDEX file
app.get('*', function (req, res, next) {
    const host = 'http://temp';
    const url = new URL(req.url, host);
    url.pathname = '/';
    req.url = url.href.replace(host, '');
    serveStatic(req, res, next);
});
  


app.listen(9000)

console.log('api run at http://localhost:9000')