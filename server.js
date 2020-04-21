const express = require('express');
const bodyParser = require('body-parser');

const apiRouter = require('./api');

const server = express();

server.use(express.static(__dirname + '/public'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use('/api', apiRouter);

server.use('/', (req, res) => {
    res.end('ok');
});

const listener = server.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server started on ${listener.address().port}`);
    }
});
