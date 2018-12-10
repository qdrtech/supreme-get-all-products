const SupremeApi = require('./supreme-product.service');

exports.handler = (event, context, callback) => {
    SupremeApi.getItems("all", (err, data) => {
        if (err) {
            return callback(err, null)
        } else {
            return callback(null, data);
        }
    });
}