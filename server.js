const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const db = require('./models')
const PeopleRoute = require('./routes/people')
const UserRoute = require('./routes/user')
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/people',PeopleRoute)
app.use('/user',UserRoute)

db.sequelize.sync({force: true}).then(() => {
    app.listen(process.env.PORT,() => {
        console.log(`Running on port ${process.env.PORT}...`)
    })
})