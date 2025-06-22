const { Database } = require('@sqlitecloud/drivers');
require('dotenv').config();

const db = new Database(process.env.SQLITE_CLOUD_URL);

module.exports = db;
