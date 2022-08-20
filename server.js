require("dotenv").config();
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const db = require('./models')
const PeopleRoute = require('./routes/people')
const UserRoute = require('./routes/user')
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const { User } = require("./models");


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

//Authentication middleware
const setUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) next();
        else {
            const userObj = await jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(userObj.id);
            req.user = user;
            next();
        }
    } catch (error) {
        next(error);
    }
} 
app.use(setUser);
app.use('/people',PeopleRoute)
app.use('/user',UserRoute)

//Authorization middleware 
app.use(async (result, req, res, next) => {
    try {
        const existingUser = await User.findOne({where: {username: req.user ? req.user.username : result}}); //username:'username', password: hashed string
        //we will attach a JWT token to this user
        const {id, role, username} = existingUser // {id: , username: 'username'}
        const token = jwt.sign({id, role, username}, process.env.JWT_SECRET) // 
        res.status(200).cookie('token', token, {
            expires: new Date(Date.now() + 900000),
            secure: false,
            httpOnly: true
          }).send(result);
    } catch (error) {
        next(error);
    }
})

//Error handling middleware
app.use((error, req, res, next) => {
    console.error("SERVER ERROR: ", error);     //what does this means 
    if (res.statusCode < 400) res.status(500);
    res.send({
      error: error.message,
      name: error.name,
      message: error.message,
      table: error.table,
    });
  });

db.sequelize.sync().then(() => {
    app.listen(process.env.PORT,() => {
        console.log(`Running on port ${process.env.PORT}...`)
    })
})