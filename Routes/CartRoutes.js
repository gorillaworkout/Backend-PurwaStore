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
Router.post('/changeAddress',CartControllers.changeAddress)
Router.post('/changePhone',CartControllers.changePhone)
Router.post('/plusQty',CartControllers.plusQty)
Router.post('/minusQty',CartControllers.minusQty)
Router.post('/deleteQty',CartControllers.deleteQty)
Router.get('/getAllKupon',CartControllers.getAllKupon)
Router.post('/getKuponByKupon',CartControllers.getKuponByKupon)



module.exports=Router