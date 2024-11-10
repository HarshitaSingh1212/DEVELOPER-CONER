const port = 8080
const mongo = {
    uri:'mongodb://database:27017/mongodb',
    options:{
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
}
module.exports = { port,mongo };