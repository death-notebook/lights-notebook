const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const db = require('./models')
const PeopleRoute = require('./routes/people')
app.use('/people',PeopleRoute)

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

db.sequelize.sync().then(() => {
    app.listen(4306,() => {
        console.log('Running on port 4306...')
    })
})