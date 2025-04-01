// const { DataTypes } = require('sequelize')
// const sequelize = require('../utils/database')

// const Cart = sequelize.define('cart', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
// })

// module.exports = Cart

// module.exports = class Cart {
//   static addProduct(id, price) {
//     fs.readFile(p, (err, fileContent) => {
//       let cart = { products: [], totalPrice: 0 }

//       if (!err) { // cart exists
//         cart = JSON.parse(fileContent)
//       }

//       const existingProductIndex = cart.products.findIndex(product => product.id === id)
//       const existingProduct = cart.products[existingProductIndex]
//       let updatedProduct

//       if (existingProduct) {
//         updatedProduct = { ...existingProduct, quantity: existingProduct.quantity += 1 }
//         cart.products[existingProductIndex] = updatedProduct
//       } else {
//         updatedProduct = { id: id, quantity: 1 }
//         cart.products = [...cart.products, updatedProduct]
//       }
//       cart.totalPrice += +price

//       fs.writeFile(p, JSON.stringify(cart), (err) => console.log(err))
//     })
//   }

//   static deleteProduct(id, price) {
//     fs.readFile(p, (err, fileContent) => {
//       if (err) return

//       const cart = JSON.parse(fileContent)
//       const updatedCart = { ...cart }
//       const existingProduct = updatedCart.products.find(p => p.id === id)

//       if (existingProduct) {
//         updatedCart.totalPrice -= existingProduct.quantity * price
//         updatedCart.products = updatedCart.products.filter(p => p.id !== id)

//         fs.writeFile(p, JSON.stringify(updatedCart), (err) => console.log(err))
//       }
//     })
//   }

//   static getCart(callback) {
//     fs.readFile(p, (err, fileContent) => {
//       const cart = JSON.parse(fileContent)
//       if (err) {
//         callback(null)
//       } else {
//         callback(cart)
//       }
//     })
//   }
// }