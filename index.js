const SupremeApi = require('./supreme-product.service');

exports.handler = async (event, context, callback) => {
    await SupremeApi.getItems("all", (err, data) => {
        callback(err, data);
    });
}