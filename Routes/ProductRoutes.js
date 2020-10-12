const Router = require('express').Router()
const {ProductControllers} = require('./../Controllers')

Router.get('/prodHomeAll',ProductControllers.getAllHomeProduct)
Router.get('/prodHomeApple',ProductControllers.getAllApple)
Router.get('/prodHomeSamsung',ProductControllers.getAllSamsung)
Router.get('/prodHomeView',ProductControllers.getMostViewed)
Router.get('/getProductById/:id',ProductControllers.getProductById)
module.exports=Router