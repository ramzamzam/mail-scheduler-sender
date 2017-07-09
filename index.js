"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const config = require('./config.json');
const app = express();

const mailer = require('nodemailer');
const transport = mailer.createTransport(config.transport);

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
        from: 'yevheniy.miropolets@gmail.com',
        text: text
    };
    transport.sendMail(mail, (err) => {
        if(err) return res.status(400).end(err.toString());
        return res.status(200).end();
    });
});

app.listen(config.PORT, function(err) {
    if(err) console.error(err);
    console.log(`sending_agent listening on port ${config.PORT}`);
    const options = {
        url : `${config.MASTER_URI}/register/sender`,
        headers: {
            'x-port' : config.PORT
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
