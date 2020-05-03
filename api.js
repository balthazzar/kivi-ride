const express = require('express');
const router = express.Router();
const googleApi = require('./google-api');
const ligaTaxiApi= require('./ligataxi-api');
const Promise = require('bluebird');
const nodemailer = require('nodemailer');

router.post('/order-mail', (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kivimenedzer05@gmail.com',
            pass: '66202722004'
        }
    });

    let header = '';

    switch(+req.body.type) {
        case 1:
            header = "Заказ пешего курьера";
            break;
        case 2:
            header = "Заказ доставки";
            break;
        case 3:
            header = "Заказ такси";
            break;
        default:
            header = "Новый заказ";
    }

    let messageBody = '';

    (req.body.point || []).forEach((point, i) => {
        if (!i) {
            messageBody += `
        Откуда: ${point || ''}
        Подъезд: ${req.body.pointEntrance[i] || ''}
        ${ [1, 2].includes(+req.body.type) ? 'Квартира: ' + (req.body.pointRoom[i] || '') : ''}
            `;
        } else if (i === 1) {
            messageBody += `
        Куда: ${point || ''}
        Подъезд: ${req.body.pointEntrance[i] || ''}
        ${ [1, 2].includes(+req.body.type) ? 'Квартира: ' + (req.body.pointRoom[i] || '') : ''}
            `;
        } else {
            messageBody += `
        Дополнительный адрес: ${point || ''}
        Подъезд: ${req.body.pointEntrance[i] || ''}
        ${ [1, 2].includes(+req.body.type) ? 'Квартира: ' + (req.body.pointRoom[i] || '') : ''}
            `;
        }
    });

    const switchCargo = (cargo) => {
        switch (cargo) {
            case 1:
                return 'до 5 кг';
            case 2:
                return '5 - 10 кг';
            case 3:
                return '10 - 15 кг';
            case 4:
                return '15 - 20 кг';
            case 5:
                return 'до 20 кг';
            case 6:
                return '20 - 40 кг';
            case 7:
                return '40 - 60 кг';
        }
    };

    messageBody += `
        Имя: ${req.body.clientName || ''}
        Номер телефона: ${req.body.clientPhone || ''}
        ${ [1, 2].includes(+req.body.type) ? 'Груз: ' + switchCargo(+req.body.cargo) : ''}
        ${ [1, 2].includes(+req.body.type) ? 'Время доставки: ' + (req.body.date + ' с ' + req.body.minF + ' по ' + req.body.minT) : ''}
        Комментарий к заказу: ${req.body.comment || ''}`;

    transporter.sendMail({
        from: "Сайт для заказа такси <kivimenedzer05@gmail.com>",
        to: 'kivimenedzer05@gmail.com',
        subject: header,
        text: messageBody
    }).catch(console.log);

    res.end();
});

router.post('/work-mail', (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kivimenedzer05@gmail.com',
            pass: '66202722004'
        }
    });

    let header = 'Заявка на работу';

    const switchSort = (sort) => {
        switch (sort) {
            case 'vod-taxi':
                return 'водитель такси';
            case 'vod-cour':
                return 'водитель курьер';
            case 'vod-taxi-cour':
                return 'водительно такси-курьер';
            case 'cur':
                return 'пеший курьер';
        }
    };

    let messageBody = `
        Имя: ${req.body.name}
        Телефон: ${req.body.phone}
        Вид дейтельности: ${switchSort(req.body.sort)}
        Комментарий: ${req.body.comment}
    `;

    transporter.sendMail({
        from: "Сайт для заказа такси <kivimenedzer05@gmail.com>",
        to: 'alfa.manevr@yandex.by',
        subject: header,
        text: messageBody
    }).catch(console.log);

    res.end();
});

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
