const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const apiRouter = require('./api');

const server = express();

var whitelist = ['http://localhost:3000', 'http://kivi-ride.by', 'https://kivi-ride.by'];

server.use('/', express.static('public'));

/*
server.use(cors({
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}));
*/
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());
server.use('/api', apiRouter);

/*
server.use('/', (req, res) => {
    res.end('ok');
});
*/

const listener = server.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server started on ${listener.address().port}`);
    }
});
