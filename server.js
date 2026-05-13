const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const app = express();

const mongodb = require('./data/database');
const e = require('express');

const port = process.env.PORT || 3000;

app.use('/', require('./routes'));



mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    }
    else {
        app.listen(port, () => (console.log(`Database is listening and node is running on port ${port}`)));
    }
});