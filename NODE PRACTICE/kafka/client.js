const { Kafka } = require('kafkajs')

exports.kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092', 'localhost:9092'] // Use the actual IP addresses of your Kafka brokers
})