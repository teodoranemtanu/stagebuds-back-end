const redis = require('redis');

let initRedis = () => {
    const client = redis.createClient();
    return new Promise((res, rej) => {
        client.on('connect', () => {
            res(client);
        });
        client.on('error', (err) => {
            rej(err)
        });
    });
};

module.exports = initRedis;