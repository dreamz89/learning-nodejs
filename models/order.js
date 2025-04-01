const { Schema, model } = require('mongoose')

const orderSchema = new Schema({
  user: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: String
  },
  products: [
    {
      product: Object,
      quantity: Number
    }
  ]
})

module.exports = model('Order', orderSchema)



// const { DataTypes } = require('sequelize')
// const sequelize = require('../utils/database')

// const Order = sequelize.define('order', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
// })

// module.exports = Order