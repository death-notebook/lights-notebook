require('dotenv').config()
const express = require("express");
const router = express.Router();
const crypto = require('crypto'); //native to node
const bcrypt = require('bcrypt'); //npm install
const cors = require('cors');
const cookieParser = require("cookie-parser"); // you need this to access req.cookies
const { User, People } = require("../models");
const SALT_COUNT = 10; //defined by us


const jwt = require('jsonwebtoken');
const JWT_SECRET  = "" + process.env.JWT_SECRET;

// user registration 
router.post("/", async (req, res, next) => {
  try {
    const {username, password} = req.body
    const bcrypassword = await bcrypt.hash(password,SALT_COUNT)
    const newUser= await User.create({ username, password: bcrypassword});
    const token = jwt.sign({id: newUser.id, username: newUser.username}, JWT_SECRET) // generates a token
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});


// Get for signin
router.get("/login", async (req, res, next) => {
    try{
    const {username, password} = req.body
    const existingUser = await User.findOne({where: {username}}); //username:'username', password: hashed string
    const isAMatch = await bcrypt.compare(password, existingUser.password) // returns a boolean
    if(isAMatch) {
      //we will attach a JWT token to this user
      const {id, username} = existingUser // {id: , username: 'username'}
      const token = jwt.sign({id, username}, JWT_SECRET) // 
      res.status(200).cookie('access-token', token, {
        expires: new Date(Date.now() + 9999),
        secure: true,
        httpOnly: true
      }).send(token);
    } else {
        res.sendStatus(401).send('USER DOES NOT EXIST')
      }
    } catch (error) {
      console.error(error);
      next(error)
    }
  })

// Once the user logged in we want to serve diff content 

router.get('/role', async (req, res, next) => {
        try {
         const token = req.cookies.token
         const decryptUser = await jwt.verify(token, JWT_SECRET) 
         const {id, username} = token
         if(decryptUser) {
             if(User.role === 'Admin'){
                 const allpeople = await People.findAll()
                 res.json(allpeople)
             }else{
                const onlyCreatedByUser= await People.findAll({where:{userId:id}})
                res.json(onlyCreatedByUser)
             }
         } else {
           res.send('PLEASE LOG IN')
         }
        } catch (err) {
          console.error(err)
        }
      })


  module.exports = router;