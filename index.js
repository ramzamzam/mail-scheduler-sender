"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const config = require('./config.json');
const app = express();

const mailer = require('nodemailer');
const transport = mailer.createTransport(config.transport);

/**
 * Emulates network delay
 */
function networkLagMiddleware(req, res, next) {
    const time = (Math.random() * 3000).toFixed(0);
    setTimeout(function() {
        return next();
    }, time);
}

app.use(bodyParser.json());

app.use(networkLagMiddleware);

app.post('/send', (req, res) => {
    const {email, text} = req.body;
    const mail = {
        to: email,
        text: text
    };
    transport.sendMail(mail, (err) => {
        if(err) return res.status(400).end(err.toString());
        return res.status(200).end();
    });
});

const args = process.argv.slice(2); //drop node index
const httpPort = args[0] || config.PORT

app.listen(httpPort, function(err) {
    if(err) console.error(err);
    console.log(`sending_agent listening on port ${httpPort}`);
    const options = {
        url : `${config.MASTER_URI}/register/sender`,
        headers: {
            'x-port' : httpPort
        }
    };
    request(options, function (err) {
        if(err) {
            console.error('error connecting to master');
            console.error(err);
            return;
        }
        console.log('connected to master')

    });
});
