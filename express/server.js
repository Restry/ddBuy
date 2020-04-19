'use strict';
const express = require('express');
const path = require('path');
const fs = require('fs');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
// const api = require('./yuque');
// const fallback = require('connect-history-api-fallback')
const proxy = require('express-http-proxy');
const axios = require('axios');




const router = express.Router();
router.use('/', (req, res) => {
  // const { p } = req.query;
  // res.writeHead(200, { 'Content-Type': 'text/html' });
  const baseUrl = 'http://api.7-orange.cn:7300/mock/5def6a2d448e330a1116366e/api';
  console.log(`query:${JSON.stringify(req.query)}`);
  // req.originalUrl;
  axios.get(baseUrl + req.originalUrl).then(({ data }) => {
    res.json(data)
  }).catch((err) => {
    res.send(err.message);
  });
  // res.write(fs.readdirSync(path.resolve(__dirname, decodeURIComponent(p))).join(';'));
  // res.end();
});

// 反向代理
// router.use('/', proxy('http://www.baidu.com/', {
//   // decorateRequest: function (proxyReq, originalReq) {
//   //   // you can update headers 
//   //   proxyReq.headers['x-request-id'] = Math.random().toString(36).substring(-10);
//   //   // you can change the method 
//   //   // proxyReq.method = 'GET';
//   //   // you can munge the bodyContent. 
//   //   // proxyReq.bodyContent = proxyReq.bodyContent.replace(/losing/, 'winning!');
//   //   return proxyReq;
//   // },
//   https: false
// }));

// router.get('/', (req, res) => res.sendFile(path.resolve(__dirname, '../dist/index.html')));
// router.use('/api', api);

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
// app.use(fallback());

module.exports = app;
module.exports.handler = serverless(app);