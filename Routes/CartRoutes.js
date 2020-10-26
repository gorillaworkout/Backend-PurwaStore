const Router = require('express').Router()
const {CartControllers} = require('./../Controllers')

Router.get('/allQty/:id',CartControllers.getAllQty)
// Router.get('/getQtyById/:id',CartControllers.checkQtyById)
// Router.get('/getQtyById/:id/:productId',CartControllers.checkQtyById) // ini pake params
Router.get('/getQtyById',CartControllers.checkQtyById) // ini nanti pake req.query
Router.post('/addQty',CartControllers.addQty)
Router.post('/addTransactions',CartControllers.payment)
Router.post('/addNewTransactions',CartControllers.newPayment)
Router.post('/addNewTransactionsCC',CartControllers.paymentWithCC)
Router.post('/addTransactDetail/:id',CartControllers.transactionDetails)
Router.delete('/deleteCartTransact/:id',CartControllers.deleteTransactionCart)
Router.post('/updateQtyCart', CartControllers.updateQty)

module.exports=Router