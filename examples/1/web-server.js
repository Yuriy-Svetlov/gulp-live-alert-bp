'use strict';

const 
  express = require('express');

const 
  app = express(),
  port = 3000,
  host = 'localhost',
  webroot = '/dest/';


module.exports = function(){
  app.use(express.static(__dirname + webroot));

  app.get('/', function (req, res) {

    res.sendFile(webroot + 'index.html', {root: __dirname })
  });

  app.listen(port, host, () => console.log(`Open your browser: http://${host}:${port}`))
};
