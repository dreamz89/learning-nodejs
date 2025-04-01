const { Schema, model } = require('mongoose')
const Order = require('../models/order')
const product = require('./product')

const userSchema = new Schema({
  email: String,
  password: {
    type: Schema.Types.String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: Number
      }
    ]
  }
}, {
  methods: {
    addToCart(product) {
      let updatedCartProducts = [...this.cart.products]
      const cartProductIndex = this.cart.products.findIndex(prod => prod.product.toString() === product._id.toString())
      if (cartProductIndex >= 0) {
        updatedCartProducts[cartProductIndex].quantity += 1
      } else {
        updatedCartProducts.push({ product: product._id, quantity: 1 })
      }

      this.cart = {
        products: updatedCartProducts
      }

      return this.save()
    },
    deleteFromCart(productId) {
      this.cart = {
        products: this.cart.products.filter(item => item.product.toString() !== productId.toString())
      }

      return this.save()
    },
    addOrder(products) {
      const newOrder = new Order({
        products: products.map(p => ({
          quantity: p.quantity,
          product: p.product.toObject()
        })),
        user: {
          _id: this._id,
          username: this.username
        }
      })

      return newOrder.save().then(() => {
        this.cart.products = []
        return this.save()
      })
    }
  }
})

module.exports = model('User', userSchema)


// const { ObjectId } = require("mongodb")
// const getDb = require('../utils/database').getDb

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username
//     this.email = email
//     this.cart = cart ? cart : cart = { items: [] }
//     this._id = id
//   }

//   save() {
//     const database = getDb()
//     return database.collection('users')
//       .insertOne(this)
//       .catch(err => console.log(err))
//   }

//   getCart() {
//     const database = getDb()
//     const productIds = this.cart.items.map(item => item.productId)

//     return database
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return products.map(product => {
//           const item = this.cart.items.find(item => item.productId.toString() === product._id.toString())
//           return {
//             ...product,
//             quantity: item.quantity
//           }
//         })
//       })
//   }

//   addToCart(product) {
//     let updatedCartItems = [...this.cart.items]
//     const cartItemIndex = this.cart.items.findIndex(item => item.productId.toString() === product._id.toString())
//     if (cartItemIndex >= 0) {
//       updatedCartItems[cartItemIndex].quantity += 1
//     } else {
//       updatedCartItems.push({ productId: product._id, quantity: 1 })
//     }

//     const database = getDb()
//     return database
//       .collection('users')
//       .updateOne(
//         { _id: this._id },
//         { $set: { cart: { items: updatedCartItems } } }
//       )
//   }

//   deleteFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString())

//     const database = getDb()
//     return database
//       .collection('users')
//       .updateOne(
//         { _id: this._id },
//         { $set: { cart: { items: updatedCartItems } } }
//       )
//   }

//   getOrders() {
//     const database = getDb()

//     return database
//       .collection('orders')
//       .find({ 'user._id': this._id })
//       .toArray()
//       .then(orders => {
//         return orders
//       })
//   }

//   addOrder() {
//     const database = getDb()
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: this._id,
//             username: this.username
//           }
//         }

//         return database
//           .collection('orders')
//           .insertOne(order)
//       })
//       .then(() => {
//         this.cart = { items: [] }
//         return database
//           .collection('users')
//           .updateOne(
//             { _id: this._id },
//             { $set: { cart: { items: [] } } }
//           )
//       })
//   }

//   static fetchOne(id) {
//     const database = getDb()
//     return database
//       .collection('users')
//       .findOne({ _id: ObjectId.createFromHexString(id) })
//       .then((user) => {
//         return user
//       })
//       .catch(err => console.log(err))
//   }
// }

// module.exports = User