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
  const baseUrl = 'http://api.7-orange.cn:7300/mock/5def6a2d448e330a1116366e/api' + req.originalUrl.replace('/.netlify/functions/server', '');
  console.log(`method:${req.method},url:${baseUrl}:${JSON.stringify(req.query)}`);
  // req.originalUrl;
  axios({
    url: baseUrl,
    method: req.method,
    data: req.body,
  }).then(({ data }) => {
    res.send(data)
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

// module.exports = app;
exports.handler = async (event, context, callback) => {
  /* parse the string body into a useable JS object */
  // res.writeHead(200, { 'Content-Type': 'text/html' });
  const baseUrl = 'http://api.7-orange.cn:7300/mock/5def6a2d448e330a1116366e/api' + event.path.replace('/.netlify/functions/server', '');
  console.log(`method:${event.httpMethod},url:${baseUrl}:${JSON.stringify(event)}`);

  /**
   * tion log
Copy to clipboard

 
4:14:24 PM: 2020-04-20T08:14:24.107Z	73fa2165-1243-4272-8985-d59c7bd9e7a5	INFO	
method:GET,url:http://api.7-orange.cn:7300/mock/5def6a2d448e330a1116366e/api/homeApi:{
  "path":"/.netlify/functions/server/homeApi",
  "httpMethod":"GET","headers":{"accept":"application/json, t
  ext/plain, * ","accept-encoding":"br, gzip","accept-language":"zh-CN,zh;
  q=0.9","client-ip":"23.99.108.122","connection":"keep-alive","cookie":"langua
  ge=zh","referer":"https://mall.restry.top/","sec-fetch-dest":"empty","sec-fetc
  h-mode":"cors","sec-fetch-site":"same-origin","user-agent":"Mozilla/5.0 (iP
    hone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like G
      ecko) Version/13.0.3 Mobile/15E148 Safari/604.1","via":"https/2 Netlify[0174cf
        33-2754-4467-86ea-a49f44275847] (ApacheTrafficServer/7.1.9)","x-bb-ab":"0.34726
        3","x-bb-client-request-uuid":"0174cf33-2754-4467-86ea-a49f44275847-13787966","x-
        bb-ip":"23.99.108.122","x-bb-loop":"1","x-cdn-domain":"www.bitballoon.com"
        ,"x-country":"HK","x-datadog-parent-id":"8975343036743358900","x-datadog-s
        ampling-priority":"0","x-datadog-trace-id":"6327264325467781797","x-forwarded-for":
        "23.99.108.122","x-forwarded-proto":"https","x-language":"zh,zh;q=0.9","x-nf-client-connect
        ion-ip":"23.99.108.122"},"queryStringParameters":{"Geek-James":"59526793591394578111"},"body":"","isBase64Encoded":true}
4:14:26 PM: Duration: 2129.85 ms	Memory Usage: 74 MB	

   */
  /* construct the fauna query */
  return axios({
    url: baseUrl,
    method: event.httpMethod,
    params: event.queryStringParameters,
    data: event.body,
  }).then(({ data }) => {
    callback({
      statusCode: 200,
      data
    });
  }).catch((err) => {
    callback({
      statusCode: 500,
      data: err.message
    });
  });
}
