const SupremeApi = require('./services/supreme-product.service');

exports.handler = async (event, context, callback) => {
    var res = await SupremeApi.getItems("all");
    callback(null, res);
}