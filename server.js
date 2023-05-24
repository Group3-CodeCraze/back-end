'use strict';

const express = require('express');
const cors = require('cors');
const server = express();
require('dotenv').config();
const pg = require('pg');
const axios = require('axios');
let PORT = process.env.PORT || 3000;
const apiKey = process.env.APIkey;
server.use(cors())
server.use(express.json())

const client = new pg.Client(process.env.DATABASE_URL)



server.get(`*`, defaultHandler);
server.use(errorHandler);













function defaultHandler(req, res) {
    res.status(404).send('page not found')
}; 

function errorHandler(error, req, res) {
    const err = {
        status: 500,
        message: error
    }
    res.status(500).send(err);
}

client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`listening on ${PORT} : YES, IAM Ready`)
        })

    })