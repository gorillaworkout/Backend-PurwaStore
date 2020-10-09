const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const bearerToken = require('express-bearer-token')
require('dotenv').config()

app.use(cors())
app.use(bearerToken())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('Public'))

app.get('/', (req, res)=>{
    var dataku = {
        name:'ojan'
    }
    res.send('<h1> selamat datang jancok </h1>')
})

app.listen(5001, ()=>console.log('API aktif di Port 5001'))

