const https = require('https');
const Promise = require('bluebird');

const geocode = (address) => new Promise((resolve, reject) => {
    const url = `https://geocode-maps.yandex.ru/1.x/?geocode=${address}&apikey=033c2e70-14fd-4418-a75c-4c86dede7697&format=json`;

    https.get(
        encodeURI(url),
        res => {
            res.setEncoding('utf8');

            let body = '';

            res.on('data', data => {
                body += data;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(body).response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos);
                } else {
                    console.log(body);
                }
            });
        }
    ).on('error', err => {
        reject(err);
    })
});

module.exports = {
    geocode
};
