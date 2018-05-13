require('dotenv').config();

import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';

import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { config } from './config';

const app = express();
const env = process.env.NODE_ENV || 'development';

const port = config[env].port || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(morgan('combined'));

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
// console.log(env);

let static_dist;

if (env === 'development') {
  static_dist = express.static(path.join(__dirname, '../dist'));
} else {
  static_dist = express.static(path.join(__dirname, '../../dist'));
}
// console.log(path.join(__dirname, '../dist'));
app.use(static_dist);

const httpServer = http.createServer(app);

console.log('Listen: ' + port);
httpServer.listen(port);

console.log(config[env]);
if (config[env].ssl_enable) {
  const ssl_port = config[env].ssl_port || 9000;
  const credentials = {
    key: fs.readFileSync('/root/twca/qnap_com.key', 'utf8'),
    cert: fs.readFileSync('/root/twca/qnap_com.cer', 'utf8'),
    ca: fs.readFileSync('/root/twca/uca.cer', 'utf8')
  };

  const httpsServer = https.createServer(credentials, app);
  console.log('CORS-enabled for all origins.  Listen: ' + ssl_port);
  httpsServer.listen(ssl_port);

}
// process.send('ready');
