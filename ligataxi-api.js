const http = require('http');
const Promise = require('bluebird');
const dateformat = require('dateformat');

const calculate = (data) => new Promise((resolve, reject) => {
    // const url = `http://api-7890-minsk.ligataxi.com/api/v1/client/company/1/calculate/`;

    const postBody = {
        pickup_address: data.points[0],
        pickup_time: '2020-04-16T04:10:10', // dateformat(data.pickupTime || new Date(), 'isoDateTime'),
        car_type: data.carType || 6,
        car_extras: data.carExtras || [],
        driver_extras: [],
        destinations: data.points.length > 1 ? data.points.slice(1) : data.points,
        return_route: false
    };

    console.log(postBody)
    const options = {
        hostname: 'api-7890-minsk.ligataxi.com',
        path: '/api/v1/client/company/1/calculate/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'api-key': 'cd23275349f8bb39f151e92748ad6876',
            'Content-Length': Buffer.byteLength(JSON.stringify(postBody))
        }

    };

    const req = http.request(
        options,
        res => {
            res.setEncoding('utf8');

            let body = '';

            res.on('data', data => {
                body += data;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(body));
                } else {
                    reject(body);
                }
            });
        }
    ).on('error', err => {
        reject(err);
    });

    req.write(JSON.stringify(postBody));
    req.end();
});

const order = (data) => new Promise((resolve, reject) => {
    const postBody = {
        pickup_address: data.points[0],
        pickup_time: '2020-04-16T04:10:10', // dateformat(data.pickupTime || new Date(), 'isoDateTime'),
        car_type: data.carType || 6,
        car_extras: data.carExtras || [],
        driver_extras: [],
        destinations: data.points.length > 1 ? data.points.slice(1) : data.points,
        comment: data.comment || ''
    };

    const options = {
        hostname: 'api-7890-minsk.ligataxi.com',
        path: '/api/v1/client/company/1/order/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'api-key': 'cd23275349f8bb39f151e92748ad6876',
            'uuid': 'dksjfbksdjghffidsuhfosd',
            'Content-Length': Buffer.byteLength(JSON.stringify(postBody))
        }

    };

    const req = http.request(
        options,
        res => {
            res.setEncoding('utf8');

            let body = '';

            res.on('data', data => {
                body += data;
            });

            res.on('end', () => {
                console.log(body);
                resolve(JSON.parse(body));
            });
        }
    ).on('error', err => {
        reject(err);
    });

    req.write(JSON.stringify(postBody));
    req.end();
});

const cancel = (data) => new Promise((resolve, reject) => {
    const postBody = {
        reason: data.reason || 1
    };

    const options = {
        hostname: 'api-7890-minsk.ligataxi.com',
        path: `/api/v1/client/company/1/order/${data.orderId}/`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'api-key': 'cd23275349f8bb39f151e92748ad6876',
            'uuid': 'dksjfbksdjghffidsuhfosd',
            'Content-Length': Buffer.byteLength(JSON.stringify(postBody))
        }

    };

    const req = http.request(
        options,
        res => {
            res.setEncoding('utf8');

            let body = '';

            res.on('data', data => {
                body += data;
            });

            res.on('end', () => {
                console.log(body);
                resolve(JSON.parse(body));
            });
        }
    ).on('error', err => {
        reject(err);
    });

    req.write(JSON.stringify(postBody));
    req.end();
});

const status = (data) => new Promise((resolve, reject) => {
    const options = {
        hostname: 'api-7890-minsk.ligataxi.com',
        path: `/api/v1/client/company/1/order/${data.orderId}/state/`,
        method: 'GET',
        headers: {
            'api-key': 'cd23275349f8bb39f151e92748ad6876',
            'uuid': 'sfdgfdsfgsdf'
        }
    };

    const req = http.request(
        options,
        res => {
            res.setEncoding('utf8');

            let body = '';

            res.on('data', data => {
                body += data;
            });

            res.on('end', () => {
                resolve(JSON.parse(body));
            });
        }
    ).on('error', err => {
        reject(err);
    });

    req.end();
});

const driver = (data) => new Promise((resolve, reject) => {
    const options = {
        hostname: 'api-7890-minsk.ligataxi.com',
        path: `/api/v1/client/company/1/order/${data.orderId}/driver/`,
        method: 'GET',
        headers: {
            'api-key': 'cd23275349f8bb39f151e92748ad6876',
            'uuid': 'sfdgfdsfgsdf'
        }
    };

    const req = http.request(
        options,
        res => {
            res.setEncoding('utf8');

            let body = '';

            res.on('data', data => {
                body += data;
            });

            res.on('end', () => {
                resolve(JSON.parse(body));
            });
        }
    ).on('error', err => {
        reject(err);
    });

    req.end();
});

module.exports = {
    calculate,
    order,
    cancel,
    status,
    driver
};
