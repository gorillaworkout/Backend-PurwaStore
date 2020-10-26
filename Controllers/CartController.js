const {db}=require('../Connection')

module.exports={

      checkQtyById:(req,res)=>{
        //   var {id,productId}=req.params
          var {id,productId}= req.query
        // console.log(req.query)
          let sql=`select * from cart c
          join users u
          on u.id = c.UserId
          join products p 
          on p.id = c.ProductId
          where (u.id=${id} AND p.id = ${productId})`
          db.query(sql,(err,resultAllQty)=>{
            //   console.log(resultAllQty)
              if(err)return res.status(500).send(err)
              return res.status(200).send(resultAllQty)
          })
      },  

    getAllQty:(req,res)=>{
        var {id} = req.params
        console.log(id)
        let sql =`
        select * from cart c
        join users u
        on u.id = c.UserId
        join products p 
        on p.id = c.ProductId
        where c.UserId = ${id}`

        db.query(sql,(err,resultQty)=>{
            // console.log(resultQty)
            // console.log(id)
            if(err) return res.status(500).send(err)
            return res.status(200).send(resultQty)
        })
    },
    addQty:(req,res)=>{
        var data=req.body
        // console.log(data)
        var sql=`insert into cart set ?`
        db.query(sql,data,(err,resultAdd)=>{
            if(err) return res.status(500).send(err)
            
            db.query(`select * from cart`,(err,resultQuery)=>{
                if(err){
                    return res.status(500).send(err)
                }
                return res.status(200).send(resultQuery)
            })

        })
    },

    payment:(req,res)=>{
        var data =req.body
        var sql = `insert into transactions set ?`
        db.query(sql,data,(err,resultPayment)=>{
            console.log(resultPayment)
            if(err) return res.status(500).send(err)
            // return res.status(200).send(resultPayment.data)
            db.query(`select * from transactions
                        order by id desc;`,(err,resultQuery)=>{
                if(err)return res.status(500).send(err)
                return res.status(200).send(resultQuery)
            })
        })
    },

    transactionDetails:(req,res)=>{
        var data = req.body
        var sql = `insert into transactiondetails set ?`
        db.query(sql,data,(err,resultTD)=>{
            if(err) return res.status(500).send(err)
            db.query(`Select * from transactiondetails`,(err,results)=>{
                if(err) return res.status(500).send(err)
                return res.status(200).send(results)
            })
        })

    },

    deleteTransactionCart:(req,res)=>{
        let {id} = req.params
        let sql = `delete from cart where userId=${id}`
        db.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            db.query(`Select * from cart`,(err,resultCart)=>{
                if(err) return res.status(500).send(err)
                return res.status(200).send(resultCart)
            })
        })
    },

    paymentWithCC:(req,res)=>{
        // console.log(req.body)
        var data ={
            "status":"Completed",
            "userId":req.body.userId,
            "tanggalPembayaran":req.body.tanggalPembayaran,
            "metode":"Credit Card",
            "buktiPembayaran":req.body.buktiPembayaran
        }
        var sql = `insert into transactions set ?`
        db.query(sql,data,(err,resultPayment)=>{
            // console.log(resultPayment,'ini result payment')
            if(err) return res.status(500).send(err)

            sql="INSERT INTO transactiondetails (transactionId, productId,price,qty) VALUES ?"
            console.log(resultPayment.insertId,'ini RP insert ID')
            var kosong = req.body.sqlCart.map((val,index)=>{
                console.log(val)
                return [
                    resultPayment.insertId,
                    val.ProductId,
                    val.harga,
                    val.Qty
                ]
            })
            console.log(kosong,'cart')
            db.query(sql,[kosong],(err,resultTD)=>{
                if(err) return res.status(500).send(err)
                        
                sql=`delete  from cart where UserId=${req.body.userId}`
                db.query(sql,(err)=>{
                    if(err) return res.status(500).send(err)

                    sql = `select * from cart c
                    join users u
                    on u.id = c.UserId
                    join products p 
                    on p.id = c.ProductId
                    where c.UserId = ?`
                    db.query(sql, [req.body.userId], (err, finalcart)=>{
                        if(err) return res.status(500).send(err)
                        console.log('success pay with cc')

                        return res.status(200).send({cart: finalcart})
                    })
                    
                })
                // return res.status(200).send(resultTD)
            })                             

            // return res.status(200).send(resultPayment)
        })

    },

    // values = [['john','high]]
    newPayment:(req,res)=>{
        console.log(req.body,'RB')
        var data ={
            "status":"Waiting Admin",
            "userId":req.body.userId,
            "tanggalPembayaran":req.body.tanggalPembayaran,
            "metode":"upload",
            "buktiPembayaran":req.body.buktiPembayaran
        }

            var sql = `insert into transactions set ?`
            db.query(sql,data,(err,resultPayment)=>{
                console.log(resultPayment,'RP123')
                if(err){
                    console.log(err)
                    return res.status(500).send(err)
                }
                // return res.status(200).send(resultPayment.data)    
                sql="INSERT INTO transactiondetails (transactionId, productId,price,qty) VALUES ?"
                console.log(resultPayment.insertId,'RP')
                var kosong = req.body.sqlCart.map((val,index)=>{
                    return [
                        resultPayment.insertId,
                        val.ProductId,
                        val.harga,
                        val.Qty
                    ]
                })
                // console.log(kosong,'cart')
                db.query(sql,[kosong],(err,resultTD)=>{
                    if(err){
                        console.log(err)
                        return res.status(500).send(err)
                    }
                            
                    sql=`delete from cart where UserId=${req.body.userId}`
                    db.query(sql,(err)=>{
                        if(err){
                            console.log(err)
                            return res.status(500).send(err)
                        }
                        sql = `select * from cart c
                        join users u
                        on u.id = c.UserId
                        join products p 
                        on p.id = c.ProductId
                        where c.UserId = ?`
                        db.query(sql, [req.body.userId], (err, finalcart)=>{
                            if(err){
                                console.log(err)
                                return res.status(500).send(err)
                            }
                            console.log('success pay with tr')
                            
                            return res.status(200).send({cart: finalcart})
                        })
                    })
                    // return res.status(200).send(resultTD)
                })                             
            })
    },
    updateQty: (req, res)=>{
        const {iduser, idprod} = req.body
        let sql = `select * from cart where UserId = ${db.escape(iduser)} and ProductId = ${db.escape(idprod)}`
        db.query(sql, (err, datacart)=>{
            if(err){
                console.log(err)
                return res.status(500).send(err)
            } 
            console.log(datacart[0].Qty, 'ini qty')
            let dataupdate = {
                Qty: datacart[0].Qty + 1

            }
            let sql = `Update cart set ? where UserId = ${db.escape(iduser)} and ProductId = ${db.escape(idprod)}`
    
            db.query(sql, dataupdate, (err)=>{
                if(err){
                    console.log(err)
                    return res.status(500).send(err)
                } 

                let sql =`select * from cart c join users u on u.id = c.UserId join products p on p.id = c.ProductId where c.UserId = ${iduser}`

                db.query(sql,(err,results)=>{
                    // console.log(resultQty)
                    // console.log(id)
                    if(err){
                        console.log(err)
                        return res.status(500).send(err)
                    }
                    return res.status(200).send(results)
                })

            })

        })
        
    }
    


}