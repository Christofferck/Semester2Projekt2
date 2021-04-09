if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const app = express();
const expressEjsLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const flash = require('connect-flash') //
const session = require('express-session') //
const passport = require('passport') //

const indexRouter = require('./routes/index')
const authorRouter = require('./routes/author')
const bookRouter = require('./routes/books')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

app.use('/public', express.static('public'));
app.use(expressEjsLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))
app.use(express.urlencoded({extended : false}))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
    })
app.use('/', indexRouter)
app.use('/author', authorRouter)
app.use('/books', bookRouter)
app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)

require('./config/passport')(passport)

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to mongoose'))
app.listen(process.env.PORT || 3000)

