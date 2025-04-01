const express = require('express')
const { body } = require('express-validator')

const router = express.Router()

const adminController = require('../controllers/admin')
const middleware = require('../utils/middleware')

router.get('/products', middleware.isAuth, adminController.getProducts)

router.get('/add-product', middleware.isAuth, adminController.getAddProduct)

router.post('/add-product', 
  body('price').isFloat(), 
  middleware.isAuth, 
  adminController.postAddProduct)

router.get('/edit-product/:productId', middleware.isAuth, adminController.getEditProduct)

router.post('/edit-product', 
  body('price').isFloat(), 
  middleware.isAuth, 
  adminController.postEditProduct)

router.post('/delete-product', middleware.isAuth, adminController.postDeleteProduct)

module.exports = router