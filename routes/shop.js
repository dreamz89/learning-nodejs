const express = require('express')

const shopController = require('../controllers/shop')
const middleware = require('../utils/middleware')

const router = express.Router()

router.get('/', shopController.getIndex)

router.get('/products', shopController.getProducts)

router.get('/products/:productId', shopController.getProduct)

router.get('/cart', middleware.isAuth, shopController.getCart)

router.post('/cart', middleware.isAuth, shopController.postCart)

router.post('/cart-delete-product', middleware.isAuth, shopController.postDeleteCartProduct)

router.get('/orders', middleware.isAuth, shopController.getOrders)

router.post('/add-order', middleware.isAuth, shopController.postAddOrder)

router.get('/orders/:orderId', middleware.isAuth, shopController.getInvoice)

module.exports = router