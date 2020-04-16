const express = require('express');
const router = express.Router();
const googleApi = require('../services/google-api');
const ligaTaxiApi= require('../services/ligataxi-api');
const Promise = require('bluebird');

router.get('/health', function(req, res) {
    res.json({
        status: 'ok'
    });
});

router.post('/ride-cost', function(request, response) {
    console.log(request.body);
    const { points, carType, pickupTime, carExtras, driverExtras } = request.body;

    Promise.all(points.map(point => googleApi.geocode(point))).then(res => {
        ligaTaxiApi.calculate({
            points: res.map(point => {
                const coords = point.split(' ');

                return {
                    street: '',
                    building: '',
                    comment: '',
                    lat: +coords[1],
                    lng: +coords[0]
                };
            }),
            carType,
            pickupTime,
            carExtras,
            driverExtras
        }).then(res1 => response.json(res1)).catch(console.log);
    });
});

router.post('/order', function(request, response) {
    const { points, carType, pickupTime, carExtras, driverExtras, comment } = request.body;

    Promise.all(points.map(point => googleApi.geocode(point))).then(res => {
        ligaTaxiApi.order({
            points: res.map(point => {
                const coords = point.split(' ');

                return {
                    street: '',
                    building: '',
                    comment: '',
                    lat: +coords[1],
                    lng: +coords[0]
                };
            }),
            carType,
            pickupTime,
            carExtras,
            driverExtras,
            comment
        }).then(response.json).catch(console.log);
    }).catch(err => {
        response.end(err.toString());
    });
});

router.get('/status/:orderId', function(request, response) {
    const { orderId } = request.params.orderId;

    ligaTaxiApi.status({
        orderId
    }).then(response.json).catch(console.log);
});

router.get('/driver/:orderId', function(request, response) {
    const { orderId } = request.params.orderId;

    ligaTaxiApi.driver({
        orderId
    }).then(response.json).catch(console.log);
});

router.delete('/cancel/:orderId', function(request, response) {
    const { orderId } = request.params.orderId;
    const { reason } = request.query.reason;

    ligaTaxiApi.cancel({
        orderId,
        reason
    }).then(response.json).catch(console.log);
});

module.exports = router;
