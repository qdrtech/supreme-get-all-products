const SupremeApi = require('./supreme-product.service');

exports.handler = async (event, context, callback) => {
    var it = await SupremeApi.getItems("all", callback);
}