const express = require('express');
const serveIndex = require('serve-index');

process.on('uncaughtException', err => console.error('uncaughtException', err));
process.on('unhandledRejection', err => console.error('unhandledRejection', err));

const app = express();

// setting cors header
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.header('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  //res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.header('Access-Control-Allow-Credentials', true);
  //throw new Error()
  next();
})

// Serve URLs like /ftp/thing as public/ftp/thing
// The express.static serves the file contents
// The serveIndex is this module serving the directory
app.use('/ftp', express.static('public'), serveIndex('public', { 'icons': true }));

app.get('/', (req, res, next) => res.status(403).send('forbidden'));

app.use(function (req, res, next) {
  res.status(404);
  // respond with html page
  if (req.accepts('html')) return res.send('not found');
  // respond with json
  if (req.accepts('json')) return res.send({ error: 'Not found' });
});

// 
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send('Internal server error');
})

// Listen
app.listen(3000, () => console.log('Server is running on http://localhost:3000/ftp'));
