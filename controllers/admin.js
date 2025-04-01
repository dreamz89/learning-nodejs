const { validationResult } = require('express-validator')

const Product = require('../models/product')
const fileHelper = require('../utils/file')

exports.getProducts = (req, res, next) => {
  Product
    .find({ userId: req.user._id })
    .then(products => {
      res.render('admin/products', {
        pageTitle: 'Admin Products',
        path: '/admin/products',
        prods: products,
      })
    })
    .catch(err => console.log(err))
}

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    product: null,
    editing: false,
    errorMessage: null,
    errors: null
  })
}

exports.postAddProduct = (req, res, next) => {
  const { title, price, description } = req.body
  const image = req.file

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      product: {
        title,
        price,
        description
      },
      editing: false,
      errorMessage: 'Attached file is invalid',
      errors: []
    })
  }

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      product: {
        title,
        price,
        description
      },
      editing: false,
      errorMessage: errors.array()[0].msg,
      errors: errors.array()
    })
  }

  const product = new Product({
    title,
    price,
    description,
    imageUrl: '/' + image.path,
    userId: req.user._id
  })

  product
    .save()
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      next(err)
    })

}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit === 'true'
  if (!editMode) {
    return res.redirect('/')
  }
  const productId = req.params.productId

  Product
    .findById(productId)
    .then(product => {
      if (!product) {
        return res.redirect('/')
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        product: product,
        editing: editMode,
        errorMessage: null,
        errors: null
      })
    })
    .catch(err => {
      next(err)
    })
}

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, description } = req.body
  const image = req.file

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      product: {
        _id: productId,
        title,
        price,
        description
      },
      editing: true,
      errorMessage: errors.array()[0].msg,
      errors: errors.array()
    })
  }

  Product
    .findById(productId)
    .then(product => {
      if (product.userId.toString() === req.user._id.toString()) {
        product.title = title
        product.price = price
        product.description = description
        if (image) {
          fileHelper.deleteFile(product.imageUrl)
          product.imageUrl = '/' + image.path
        }
        return product.save().then(() => {
          res.redirect('/admin/products')
        })
      } else {
        return res.redirect('/')
      }
    })
    .catch(err => {
      next(err)
    })
}

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId

  Product
    .findById(productId)
    .then(product => {
      fileHelper.deleteFile(product.imageUrl)

      return Product.deleteOne({ _id: productId, userId: req.user._id })
    })
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      next(err)
    })
}