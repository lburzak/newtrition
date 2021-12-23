const https = require("https");
const newtritionApp = require("../app");
const NewtritionClient = require("@newtrition/rest-client")
const http = require("http");

function getAddress(server, path) {
    const address = server.address();

    if (!address) server.listen(0);
    const port = server.address().port;
    const protocol = server instanceof https.Server ? 'https' : 'http';
    return protocol + '://127.0.0.1:' + port + path;
}

function buildTestClient() {
    const server = http.createServer(newtritionApp);
    const address = getAddress(server, '/api');

    return new NewtritionClient(address, {
        validateStatus: () => true
    });
}

module.exports = {
    buildTestClient
}