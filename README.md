## NodeJS learning 
Following the Udemy course [NodeJS - The Complete Guide (MVC, REST APIs, GraphQL, Deno)](https://www.udemy.com/course/nodejs-the-complete-guide) by Maximilian Schwarzmüller
Creating an Ecommerce site with authentication and authorization, show all products, create products, add to cart and create orders and invoices

<img width="823" alt="Screenshot 2025-04-01 at 10 16 31 PM" src="https://github.com/user-attachments/assets/afe4320a-9ad7-4b82-ba9a-8e349515191b" />

#### Framework
- Handling incoming requests, routes and controllers using [ExpressJS](https://expressjs.com/)

#### Templating Engines
- Create HTML pages with various templating engines like [pug](https://pugjs.org/api/getting-started.html), [handlebars](https://handlebarsjs.com/), [ejs](https://ejs.co/)

#### Database
- Working with NoSQL, MongoDB and [mongoose](https://mongoosejs.com/) to fetch products, edit and delete products, add to cart, delete cart, create orders

#### Authentication and Authorization
- Adding CSRF token to input fields using [csurf](https://www.npmjs.com/package/csurf)
- Hash signup passwords using [bcrypt](https://www.npmjs.com/package/bcrypt) to store in database, and also compare passwords during login
- Create sessions for users using [express-session](https://www.npmjs.com/package/express-session) and create session store using [connect-mongodb-session](https://www.npmjs.com/package/connect-mongodb-session)
- Adding route protection in middleware
- Generate random token for email link using node crypto
- Adding authorization for admin users

#### Emails
- Sending emails for signup and password reset using [sendgrid](https://sendgrid.com)

#### Validation
- Adding server side validation for POST requests of forms in middleware using [express-validator](https://github.com/express-validator/express-validator)
- Throwing errors on validation errors

#### File Upload and Download
- Upload product image to server using [multer](https://www.npmjs.com/package/multer)
- Store path to product image in database
- Serve product images statically from folder in server
- Generate invoice pdf using [pdfkit](https://pdfkit.org/)
- Preload or Stream invoice pdf using node filesystem
