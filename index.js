const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors=require('cors')
const bearerToken=require('express-bearer-token')
require('dotenv').config() // tesss

const PORT = process.env.PORT || 5001

app.use(cors())
app.use(bearerToken())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static('Public'))

app.get('/',(req,res)=>{
    res.send(`<h1> WELCOME customer di PurwaStore </h1>`)
})
// const {ProductRoutes} = require('./Routes')
const {ProductRoutes,CartRoutes, AdminRoutes, AuthRoutes} =require('./Routes')

app.use('/product',ProductRoutes)
app.use('/cart',CartRoutes)
app.use('/admin', AdminRoutes)
app.use('/auth', AuthRoutes)



// server.listen(5001,()=>{
//     console.log(`port Active di 5001`)
// })

app.listen(PORT, ()=>console.log('API aktif di Port: ', PORT))

