require('dotenv').config()
const express = require("express");
const router = express.Router();
const crypto = require('crypto'); //native to node
const bcrypt = require('bcrypt'); //npm install
const cors = require('cors');
const cookieParser = require("cookie-parser"); // you need this to access req.cookies
const { body, validationResult } = require('express-validator');
const { User, People } = require("../models");
const SALT_COUNT = 10; //defined by us


const jwt = require('jsonwebtoken');
const console = require('console');

// user registration
router.post("/", body('username').not().isEmpty().trim().escape(), 
                 body('email').isEmail().normalizeEmail(), 
                 body('password').isString().isLength({ min: 6 }).not().isLowercase().not().isUppercase().not().isNumeric().not().isAlpha(),
                 async (req, res, next) => {
      try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
          return res.status(400).json({ validationErrors: validationErrors.array() });
        }
        const { username, password, email } = req.body
        const bcrypassword = await bcrypt.hash(password, SALT_COUNT)
        const allUsers = await User.findAll({where:{email:email}})
        if(allUsers.length === 0 ){
        const newUser = await User.create({ username, email, password: bcrypassword });
        const token = jwt.sign({ id: newUser.id, username: newUser.username }, process.env.JWT_SECRET) // generates a token
        res.json(newUser);
        }else{
          res.send('This user already exist')
        }
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
      delete req.user;
      next(username);
    } else {
      res.sendStatus(401).send('USER DOES NOT EXIST')
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
})

// to update role  

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