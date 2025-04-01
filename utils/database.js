// const { MongoClient } = require("mongodb")

// const uri = 'mongodb+srv://evenstar1389:J$corg13mdb@udemycluster.jp5xm.mongodb.net/?retryWrites=true&w=majority&appName=UdemyCluster'

// const client = new MongoClient(uri)

// let db

// const mongoConnect = async () => {
//   try {
//     await client.connect()
//     db = client.db('shop')
//   } catch (err) {
//     console.log(err)
//   }
// }

// const getDb = () => {
//   if (db) {
//     return db
//   }
// }

// exports.mongoConnect = mongoConnect
// exports.getDb = getDb