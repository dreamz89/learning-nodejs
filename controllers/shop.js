const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')

const Product = require('../models/product')
const Order = require('../models/order')

exports.getProducts = (req, res, next) => {
  Product
    .find()
    .then(products => {
      res.render('shop/product-list', {
        pageTitle: 'Shop',
        path: '/products',
        prods: products,
      })
    })
    .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId

  Product
    .findById(productId)
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product: product,
      })
    })
    .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
  Product
    .find()
    .then(products => {
      res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/',
        prods: products,
      })
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.products.product')
    .then(user => {
      const products = user.cart.products.map(prod => ({
        _id: prod.product._id,
        title: prod.product.title,
        quantity: prod.quantity
      }))

      res.render('shop/cart', {
        pageTitle: 'Your Cart', path: '/cart', prods: products
      })
    })
    .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
  const productId = req.body.productId

  Product
    .findById(productId)
    .then(product => {
      return req.user.addToCart(product)
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.postDeleteCartProduct = (req, res, next) => {
  const productId = req.body.productId

  req.user
    .deleteFromCart(productId)
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  Order
    .find({ 'user._id': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders', path: '/orders', orders
      })
    })
    .catch(err => console.log(err))
}

exports.postAddOrder = (req, res, next) => {
  req.user
    .populate('cart.products.product')
    .then(user => {
      return req.user.addOrder(user.cart.products)
    })
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId
  const invoiceName = `invoice-${orderId}.pdf`
  const invoicePath = path.join('invoices', invoiceName)

  Order
    .findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found'))
      }

      if (order.user._id.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'))
      } else {
        // STATIC PDF
        // 1. waiting for all chunks to come together and concatenate into one object in memory before sending to browser
        // fs.readFile(invoicePath, (err, data) => {
        //   if (err) {
        //     next(err)
        //   } else {
        //     res.setHeader('Content-Type', 'application/pdf')
        //     res.setHeader('Content-Disposition', `attachment; filename=${invoiceName}`)
        //     res.send(data)
        //   }
        // })
        // 2. send each chunk directly to the browser, which concatenates them
        // const file = fs.createReadStream(invoicePath)
        // res.setHeader('Content-Type', 'application/pdf')
        // res.setHeader('Content-Disposition', `attachment; filename=${invoiceName}`)
        // file.pipe(res)

        const doc = new PDFDocument()
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`)
        doc.pipe(fs.createWriteStream(invoicePath))
        doc.pipe(res)

        doc.fontSize(26).text('Invoice', {
          align: 'center'
        })
        doc.text('----------------------', {
          align: 'center'
        })
        let totalPrice = 0
        order.products.forEach((p) => {
          totalPrice += p.quantity * p.product.price
          doc.fontSize(16).text(`${p.product.title} - ${p.quantity} x $${p.product.price}`)
        })
        doc.text(`Total Price: $${totalPrice}`)
        doc.end()
      }
    })
    .catch(err => next(err))
}

// res.sendFile - uses a stream internally
// vs
// res.download - uses res.sendFile internally, but adds the HTTP header Content-Disposition as attachment.
// vs
// fs.createReadStram(filePath) - is a lower level API with more control over the stream. You can close it early or detect specific errors, etc.

// Streaming works by sending data to the browser in chunks as soon as they are available, rather than waiting for the entire response to be generated. When chunks are written to the response object, they are transmitted immediately over the network to the browser without being fully stored in memory on the server. The browser processes these chunks incrementally, allowing rendering or processing to begin before the entire data is received. This mechanism is efficient because it reduces latency, memory usage, and provides a seamless user experience for large or dynamically generated data streams.
