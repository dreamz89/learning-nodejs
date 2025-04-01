const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  imageUrl: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = mongoose.model('Product', productSchema)


// const { ObjectId } = require("mongodb")
// const getDb = require('../utils/database').getDb

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title
//     this.price = price
//     this.description = description
//     this.imageUrl = imageUrl
//     this._id = id ? ObjectId.createFromHexString(id) : null
//     this.userId = userId
//   }

//   save() {
//     const database = getDb()
//     return database.collection('products')
//       .insertOne(this)
//       .then((result) => {
//         console.log(result)
//       })
//       .catch(err => console.log(err))
//   }

//   update() {
//     const database = getDb()
//     return database.collection('products')
//       .updateOne({ _id: this._id }, { $set: this })
//       .then((product) => {
//         return product
//       })
//       .catch(err => console.log(err))
//   }

//   static fetchAll() {
//     const database = getDb()
//     return database.collection('products')
//       .find()
//       .toArray()
//       .then((products) => {
//         return products
//       })
//       .catch(err => console.log(err))
//   }

//   static fetchOne(id) {
//     const database = getDb()
//     return database.collection('products')
//       .findOne({ _id: ObjectId.createFromHexString(id) })
//       .then((product) => {
//         console.log(product)
//         return product
//       })
//       .catch(err => console.log(err))
//   }

//   static delete(id) {
//     const database = getDb()
//     return database.collection('products')
//       .deleteOne({ _id: ObjectId.createFromHexString(id) })
//       .then((product) => {
//         return product
//       })
//       .catch(err => console.log(err))
//   }
// }

// module.exports = Product
