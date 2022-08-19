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

// user registration 
router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body
    const bcrypassword = await bcrypt.hash(password, SALT_COUNT)
    const newUser = await User.create({ username, password: bcrypassword });
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, process.env.JWT_SECRET) // generates a token
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});


// Get for signin
router.get("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body
    const existingUser = await User.findOne({ where: { username } }); //username:'username', password: hashed string
    const isAMatch = await bcrypt.compare(password, existingUser.password) // returns a boolean
    if (isAMatch) {
      next(username);
    } else {
      res.sendStatus(401).send('USER DOES NOT EXIST')
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
})

// Once the user logged in we want to serve diff content 

router.put('/role/:id', async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') res.sendStatus(401);
    else {
      await User.update({ role: req.body.role }, {
        where: {
          id: req.params.id,
        }
      });
      const result = await User.findByPk(req.params.id);
      next(result);
    }
  } catch (err) {
    next(err)
  }
})


module.exports = router;