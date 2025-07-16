require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session')
const mongoStore = require('connect-mongo')
const authController = require('./controllers/auth')
const isLoggedIn = require('./middleware/is-logged-in')
const passUserToView = require('./middleware/pass-user-to-view')

// SERVER
const port = process.env.PORT ? process.env.PORT : '3000'
const app = express();

// DB CONNECTION
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected',()=>{
    console.log(`Connected to MongoDB ${mongoose.connection.name} :)`)
})

// MIDDLEWARE

app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
        mongoUrl: process.env.MONGODB_URI,  
    })
}))
app.use(passUserToView)


// ROUTES
app.use('/auth', authController);

app.get('/',(req,res)=>{
    res.render('index.ejs',{title:'Sigma App'})
})

app.get('/vip-lounge', isLoggedIn, (req, res) => {
    res.send(`Welcome ✨`)
})

app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})

