const Router = require('express').Router()
const {CartControllers} = require('./../Controllers')

Router.get('/allQty/:id',CartControllers.getAllQty)
Router.get('/getQtyById/:id',CartControllers.checkQtyById)
// Router.get('/getQtyById/:id/:productId',CartControllers.checkQtyById)
Router.post('/addQty',CartControllers.addQty)
module.exports=Router