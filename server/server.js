const cors = require("cors")

const express = require('express');
const { reset } = require("nodemon");
const Encryption = require('./Encryption')
const winston = require('winston');
const { response } = require("express");

const app = express();
const port = 3010;

app.use(cors())
    // enable parsing application/json
app.use(express.json());
app.use(express.urlencoded())

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

app.post('/encrypt', (req, res) => {
    /* const accessKey = "$2a$08$emszZbE/rZSiTMPkEEJkYOOMDfl.ZX3sUsUi9/Uq/qp89l0ni9feC"
    const IVKey = "RC72TVfwdKZJNDhM";
    const secretKey = "Bp2mrJMzP3x9XD6R";
    const algorithm = "aes-256-cbc"; */
    const accessKey = req.body.access_key
    const IVKey = req.body.iv_key;
    const secretKey = req.body.secret_key;
    const algorithm = "aes-256-cbc";


    // get the request body
    const requestBody = req.body;
    logger.info(`CHECKOUT [Data]: ${JSON.stringify(req.body)}`);

    let encryption = new Encryption(IVKey, secretKey, algorithm)

    const payload = JSON
        .stringify(requestBody)
        .replace(/\//g, '\\/');

    // return a JSON response
    res.json({
        encrypted_payload: encryption.encrypt(payload),
        access_key: accessKey
    });
});
const handleRedirect = (message) => (req, res) => {
    // console.log(message, req.body)
    logger.info(`[Message]: ${message} [Data]: ${JSON.stringify(req.body)}`);
    res.send(message)
}
app.post('/success', handleRedirect('Handled request successfully'))
app.post('/failed', handleRedirect('Payment request failed'))
app.post('/pending', handleRedirect('Payment request is pending'))
app.get('/sample-api', (req, res) => {
    res.json({
        payment: false
    })
})

app.post('/callback', (req, res) => {
    // console.log("Payment callback", req.body)
    const message = 'Payment callback';
    logger.info(`[Message]: ${message} [Data]: ${JSON.stringify(req.body)}`);
})

app.listen(
    port,
    () => console.log(`Listening on port ${port}!`)
);