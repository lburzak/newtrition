const db = require("./db").instance;

module.exports = {
    users: db.collection('users')
}