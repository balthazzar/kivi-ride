const express = require('express');
const bodyParser = require('body-parser');

const apiRouter = require('./routes/api');

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(bodyParser.json({ type: 'application/json' }))

server.use('/api', apiRouter);

server.use('/', (req, res) => {
    res.end('ok');
});

server.listen(8080, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Server started');
    }
});
