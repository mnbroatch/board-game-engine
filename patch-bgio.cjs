// scalpel to make guts.js work
const fs = require('fs');
const path = require('path');

const serverFile = path.join(
  __dirname,
  'node_modules',
  'boardgame.io',
  'dist/cjs/server.js'
);

fs.appendFileSync(
  serverFile,
  `
exports.configureRouter = configureRouter
exports.createServerRunConfig = createServerRunConfig
exports.configureApp = configureApp
exports.getPortFromServer = getPortFromServer
exports.getPortFromServer = getPortFromServer
exports.Master = Master
exports.TransportAPI = TransportAPI
`
);
