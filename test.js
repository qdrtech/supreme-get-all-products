const handler = require("./index");

handler.handler({}, null, (err, data) => {
    console.log("Error", err);
    console.log("Data", data);
});