const express = require('express')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const csrf = require('csurf')
const flash = require('connect-flash')
const multer  = require('multer')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')
const errorController = require('./controllers/error')
const rootDir = require('./utils/path')
const User = require('./models/user')

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@udemycluster.jp5xm.mongodb.net/${process.env.MONGODB_DB}`

const app = express()
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  switch (file.mimetype) {
    case 'image/png':
    case 'image/jpg':
    case 'image/jpeg':
      cb(null, true)
    default:
      cb(null, false)
  }
}

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(multer({ storage: fileStorage, fileFilter }).single('image'))
app.use(express.static(path.join(rootDir, 'public')))
app.use('/images', express.static(path.join(rootDir, 'images')))
app.use(session({ secret: 'verylongstring', store: store, resave: false, saveUninitialized: false }))
app.use(csrf())
app.use(flash())

app.use((req, res, next) => {
  if(!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (user) {
        req.user = user
      } 

      next()
    })
    .catch(err => {
      throw new Error(err)
    })
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedin
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.use(errorController.get404)
app.use(errorController.get500)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 3000)
  })
  .catch(err => console.log(err))
