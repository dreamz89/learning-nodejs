const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { validationResult } = require('express-validator')
const User = require('../models/user')

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.getLogin = (req, res, next) => {
  const message = req.flash('error')

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message[0]
  })
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      errors: errors.array()
    })
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
          errors: []
        })
      }

      bcrypt
        .compare(password, user.password)
        .then(isMatching => {
          if (isMatching) {
            req.session.user = user
            req.session.isLoggedin = true
            // saving to mongodb takes miliseconds
            req.session.save(() => {
              res.redirect('/')
            })
          } else {
            return res.status(422).render('auth/login', {
              path: '/login',
              pageTitle: 'Login',
              errorMessage: 'Invalid email or password',
              errors: []
            })
          }
        })
    })
    .catch(err => {
      next(err)
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/')
  }) // method provided by sessions package
}

exports.getSignup = (req, res, next) => {
  const message = req.flash('error')

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: message[0],
    errors: null
  })
}

exports.postSignup = (req, res, next) => {
  const { email, password } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      errors: errors.array()
    })
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const newUser = new User({
        email,
        password: hashedPassword,
        cart: { items: [] }
      })

      return newUser.save()
    })
    .then(() => {
      res.redirect('/login')
      sgMail
        .send({
          to: email,
          from: 'mail@test.jocelyn-tan.com', // Use the email address or domain you verified above
          subject: 'Sending with Twilio SendGrid is Fun',
          text: 'and easy to do anywhere, even with Node.js',
          html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        })
        .then(() => {
          console.log('Email sent')
        }, error => {
          console.error(error)

          if (error.response) {
            console.error(error.response.body)
          }
        })
    })
}

exports.getReset = (req, res, next) => {
  const infoMessage = req.flash('info')

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    infoMessage: infoMessage[0],
  })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
    }
    const token = buffer.toString('hex')

    User
      .findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('info', 'If that email address is in our database, we will send you an email to reset your password.')
          return res.redirect('/reset')
        }
        user
          .updateOne({
            resetToken: token,
            resetTokenExpiration: Date.now() + 3600000
          })
          .then((result) => {
            req.flash('info', 'If that email address is in our database, we will send you an email to reset your password.')
            res.redirect('/reset')

            sgMail
              .send({
                to: req.body.email,
                from: 'mail@test.jocelyn-tan.com', // Use the email address or domain you verified above
                subject: 'Password reset',
                html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> within an hour to set new password</p>
              `,
              })
              .then(() => {
                console.log('Email sent')
              }, error => {
                console.error(error)

                if (error.response) {
                  console.error(error.response.body)
                }
              })
          })
      })
      .catch(err => {
        return next(err)
      })
  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token

  User
    .findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    })
    .then(user => {
      if (user) {
        const message = req.flash('error')

        res.render('auth/new-password', {
          path: '/new-password',
          pageTitle: 'New Password',
          userId: user._id.toString(),
          passwordToken: token,
          errorMessage: message[0]
        })
      } else {
        res.render('404', { pageTitle: 'Page Not Found', path: '' })
      }
    })
    .catch(err => console.log(err))
}

exports.postNewPassword = (req, res, next) => {
  const { password, passwordToken, userId } = req.body

  User
    .findOne({
      _id: userId,
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() }
    })
    .then(user => {
      bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          user.password = hashedPassword
          user.resetToken = undefined
          user.resetTokenExpiration = undefined
          return user.save()
        })
        .then(() => {
          res.redirect('/login')
        })
    })
    .catch(err => {
      return next(err)
    })
}
