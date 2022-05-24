// instructions to create a module with json-server like this one:
// https://www.npmjs.com/package/json-server#module

// default npm start is:
// "start": "json-server --watch db.json --port 3001"
// I was using:
// "start": "json-server --config json-server.json --watch db.json --middlewares ./hello_middleware.js"

// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()

const router = jsonServer.router('db.json')

const defaultsOpts = {
    logger: true,
    readOnly: false,
    noCors: false,
    noGzip: false,
    bodyParser: true
};

//bodyParser.json({ limit: '10mb', extended: false }), bodyParser.urlencoded({ extended: false })
/*
"use strict";
const bodyParser = require('body-parser');
module.exports = [bodyParser.json({
  limit: '10mb',
  extended: false
}), bodyParser.urlencoded({
  extended: false
})];
*/


// STACKOVERFLOW check NGNIX to set a big file size https://medium.com/@svsh227/error-413-request-entity-too-large-in-nginx-with-client-max-body-size-changes-in-nginx-6aacd525fe11
const bodyParser = require('body-parser');
jsonServer.bodyParser[0] = bodyParser.json({ limit: '30.001mb', extended: false })

const hello_mid = require('./hello_middleware');
const middlewares = jsonServer.defaults(defaultsOpts)
//middlewares.push(bodyParser.json({ limit: '100.001mb', extended: false }), bodyParser.urlencoded({ extended: false, parameterLimit: 20000 }))

console.log(middlewares)
middlewares.push(hello_mid)
console.log(middlewares)

console.log(new Date())

server.use(middlewares)
server.use(router)
server.listen(3001, () => {
    console.log('JSON Server is running')
})

// json-server index.js:
/*
"use strict";
const express = require('express');
module.exports = {
  create: () => express().set('json spaces', 2),
  defaults: require('./defaults'),
  router: require('./router'),
  rewriter: require('./rewriter'),
  bodyParser: require('./body-parser')
};
*/