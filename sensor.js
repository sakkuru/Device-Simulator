'use strict';
require('dotenv').config();

const Client = require('azure-iot-device').Client;
const Message = require('azure-iot-device').Message;
const Protocol = require('azure-iot-device-mqtt').Mqtt;

const connectionString = process.env.DeviceConnectionString;
const client = Client.fromConnectionString(connectionString, Protocol);

const moment = require('moment');

let sendFrequency = 1000;

client.open(err => {
    console.log('Client opened');
    if (err) {
        console.error('Could not open IotHub client');
        return;
    }
    setSendTimer(sendFrequency);
});

const setSendTimer = sendFrequency => {
    let lastTemp = 20;
    let lastHum = 60;
    setInterval(() => {
        const currentTime = moment().format();
        const temp = lastTemp + Math.random() - 0.5;
        const hum = lastHum + Math.random() - 0.5;
        const event = {
            "temperature": temp + "",
            "humidity": hum + "",
            "time": currentTime
        };
        lastTemp = temp;

        const text = JSON.stringify(event);
        sendMessage(new Message(text));
    }, sendFrequency);
};

const sendMessage = message => {
    client.sendEvent(message, err => {
        if (err) {
            console.log(err.toString());
            return;
        }
        console.log('Sending message:', message.data);
    });
};