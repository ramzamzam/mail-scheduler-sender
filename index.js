"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');
const config = require('./config.json');
const app = express();

const mailer = require('nodemailer');
const transport = mailer.createTransport(config.transport);

function networkLagMiddleware(req, res, next) {
    const time = (Math.random() * 3000).toFixed(0);
    console.log({time});
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
    transport.sendMail(mail, (err, info) => {
        if(err) return res.status(400).end(err.toString());
        return res.status(200).end();
    });
});

app.listen(config.PORT, function(err) {
    if(err) console.error(err);
    console.log(`sending_agent listening on port ${config.PORT}`);
    request(`${config.MASTER_URI}/register/sender`)
        .then((response) => {
            console.log('connected to master')
        })
        .catch(err => {
            console.error('error connecting to master');
            console.error(err);

        })

});