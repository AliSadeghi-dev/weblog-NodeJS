const path = require('path');


const debug = require('debug')("weblog-project");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const DotEnv = require('dotenv');
const morgan = require('morgan');
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const indexRoutes = require('./routes/blog');
const dashRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/users');
const connectDB = require('./config/db');


DotEnv.config({path:"./config/config.env"});


const app = express()

//* DataBase Connection
connectDB();
debug('connected to database')

require('./config/passport');
//* Statics
app.use(express.static(path.join(__dirname,"public")));


//* logger
if(process.env.NODE_ENV === "develpment"){
    app.use(morgan("dev"));
}

//* View engine
app.use(expressLayout);
app.set("layout","./layouts/mainLayout")
app.set("view engine","ejs");
app.set("views","views");

//*bodyParser
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());

//* session
app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({
        mongoUrl: process.env.DataBaseURL,
      })
})
);

//* passport
app.use(passport.initialize());
app.use(passport.session());

//* flash
app.use(flash());

//*Routes
app.use("/users",userRoutes);
app.use("/dashboard",dashRoutes);
app.use(indexRoutes);

//* 404 Page
app.use((req,res)=>{
    res.render("404",{pageTitle:"صفحه پیدا نشد|404",path:"404"});
})

const PORT = process.env.PORT

app.listen(PORT,()=>{console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)})