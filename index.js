const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const mongoose = require('mongoose');
const ConnectDB = require('./DataBase/db');
const ProductRoute = require('./Routes/product');
const UserRoute = require('./Routes/user');
const OrderRoute = require('./Routes/order');
const CategoryRoute = require('./Routes/categroies');
const authJwt = require('./Middelware/authJwt');
const errorHandler = require('./Middelware/error-Handling');


dotenv.config();

//connect to database
ConnectDB();
// require('./DataBase/db.js');


const app = express();
const api = process.env.API_URL;

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);



//routes
app.use(`${api}/products`, ProductRoute);
app.use(`${api}/users`, UserRoute);
app.use(`${api}/orders`, OrderRoute);
app.use(`${api}/categroies`, CategoryRoute);



app.listen(3000, ()=>{
   
    console.log("server started on port 3000");

})
