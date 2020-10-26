const Router = require('express').Router()
const { AdminRoutes } = require('.')
const {AdminControllers} = require('./../Controllers')

Router.get('/getAdminData', AdminControllers.getWaitingAdmin)
Router.get('/getDetailById/:id', AdminControllers.getDetailTransactionById)
Router.post('/accBuktiTransfer/:id', AdminControllers.accBuktiPembayaran)

module.exports=Router