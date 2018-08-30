'use strict'
require('dotenv').config()

const Client = require('azure-iot-device').Client
const Message = require('azure-iot-device').Message
const Protocol = require('azure-iot-device-mqtt').Mqtt

const connectionString = process.env.DeviceConnectionString
const client = Client.fromConnectionString(connectionString, Protocol)

const uuidV4 = require('uuid/v4')
const moment = require('moment')

let sendFrequency = 1000

client.open(err => {
  console.log('Client opened')
  if (err) {
    console.error('Could not open IotHub client')
    return
  }
  setSendTimer(sendFrequency)
})

const setSendTimer = sendFrequency => {
  setInterval(() => {
    const currentTime = moment()
    const created = currentTime.format()
    console.log(created)

    const probability = Math.random()
    console.log(probability)

    const tagNames = ['georgia', 'tea', 'coffee']
    const tagName = tagNames[Math.floor(Math.random() * 3)]
    console.log(tagName)

    const imageName_time = currentTime.format('YYYYMMDDHHmm')
    const imageName_device = 'cam' + 232
    const imageName = imageName_time + '_' + imageName_device + '.jpg'
    console.log(imageName)

    const event = {
      created: created,
      probability: probability,
      tagID: '',
      tagName: tagName,
      iteration: '',
      cameraID: 'NTCAM380_230',
      status: 1,
      edgeID: 'Desktop_820',
      imageName: imageName
    }
    console.log(event)

    const text = JSON.stringify(event)

    sendMessage(new Message(text))
  }, sendFrequency)
}

const sendMessage = message => {
  client.sendEvent(message, err => {
    if (err) {
      console.log(err.toString())
      return
    }
    console.log('Sending message:', message.data, '\n')
  })
}

setSendTimer(sendFrequency)
