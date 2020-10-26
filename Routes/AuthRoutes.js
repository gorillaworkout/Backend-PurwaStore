const Router = require('express').Router()
const {AuthControllers} = require('./../Controllers')

Router.post('/register', AuthControllers.register)
Router.post('/login',AuthControllers.Login)
Router.get('/keepLogin/:id', AuthControllers.keepLogin)

module.exports=Router