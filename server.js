const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const apiRouter = require('./api');

const server = express();

server.use(cors({
    origin: 'http://localhost:3000'
}));
server.use(bodyParser.urlencoded({
    extended: true
}));
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
