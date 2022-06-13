const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '/src')));

app.use(bodyParser.json());

app.use(cors());

const forceSSL = function () {
    return function (req, res, next) {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(
          ['https://', req.get('Host'), req.url].join('')
        );
      }
      next();
    }}

app.use(forceSSL());    

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/index.html'));
        });
    
    app.listen(port, () => {
    console.log('Server started on port '+port);
    });