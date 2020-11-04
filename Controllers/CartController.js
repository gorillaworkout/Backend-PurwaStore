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
        
    },
    changePhone:(req,res)=>{
        const{userId,phone}= req.body
        console.log(userId,' ini user id backend')
        console.log(phone,' ini alamat backend')
        let sql = `update Users set ? where id =${db.escape(userId)}`
        let data ={
            phone:phone
        }
        db.query(sql,data,(err)=>{
            if(err)return res.status(500).send({message:err.message})

            sql=`select * from cart c
            join users u
            on u.id = c.UserId
            join products p 
            on p.id = c.ProductId
            where c.UserId =${db.escape(userId)}`

            db.query(sql,(err,dataUser)=>{
                console.log(userId)
                console.log(dataUser, ' ini alamat baru')
                // console.log('berhasil update alamat baru')
                if(err) return res.status(500).send({message:err.message})
                return res.send(dataUser)
            })


        })
    },
    changeAddress:(req,res)=>{

        const {userId,alamat} = req.body
        console.log(userId,' ini user id backend')
        console.log(alamat,' ini alamat backend')

        let sql = `update Users set ? where id =${db.escape(userId)}`
        let data ={
            alamat:alamat
        }
        db.query(sql,data,(err)=>{
            if(err)return res.status(500).send({message:err.message})
            
            sql=`select * from cart c
            join users u
            on u.id = c.UserId
            join products p 
            on p.id = c.ProductId
            where c.UserId =${db.escape(userId)}`
            db.query(sql,(err,dataUser)=>{
                console.log(userId)
                console.log(dataUser, ' ini alamat baru')
                // console.log('berhasil update alamat baru')
                if(err) return res.status(500).send({message:err.message})
                return res.send(dataUser)
            })
            
        })
    },
    plusQty:(req,res)=>{
        const {userId}=req.body
        console.log(userId)
        let sql = `update Cart
        SET Qty=(Qty+1)
        where UserId = ${db.escape(userId)}; `

        db.query(sql,(err,dataResult)=>{
            console.log(userId)
            if(err) return res.status(500).send({message:err.message})
            sql=`select * from cart c
            join users u
            on u.id = c.UserId
            join products p 
            on p.id = c.ProductId
            where c.UserId = ${db.escape(userId)}`
            db.query(sql,(err,allData)=>{
                console.log('berhasil masuk ke allgetdata')
                if(err) return res.status(500).send({message:err.message})
                return res.send(allData)
            })
        })
    },
    minusQty:(req,res)=>{
        const {userId}=req.body
        console.log(userId)
        let sql=`update Cart
        SET Qty=(Qty-1)
        where UserId = ${db.escape(userId)};`

        db.query(sql,(err,dataResult)=>{
            console.log(userId)
            if(err) return res.status(500).send({message:err.message})
            sql=`select * from cart c
            join users u
            on u.id = c.UserId
            join products p 
            on p.id = c.ProductId
            where c.UserId = ${db.escape(userId)}`
                db.query(sql,(err,allData)=>{
                    console.log('berhasil masuk ke allgetdata')
                    if(err) return res.status(500).send({message:err.message})
                    return res.send(allData)
                })
            })
    },
    deleteQty:(req,res)=>{
            const {userId}=req.body
            console.log(userId)
            let sql=`delete from Cart where UserId=${db.escape(userId)}`
            db.query(sql,(err,dataResult)=>{
                if(err)return res.status(500).send({message:err.message})
                sql=`select * from cart c
                join users u
                on u.id = c.UserId
                join products p 
                on p.id = c.ProductId
                where c.UserId = ${db.escape(userId)}`
                    db.query(sql,(err,allData)=>{
                        console.log('berhasil delete')
                        if(err) return res.status(500).send({message:err.message})
                        return res.send(allData)
                    })
            })
    },
    getAllKupon:(req,res)=>{
        let sql=`select * from Kupon`
        db.query(sql,(err,dataKupon)=>{
            if (err) return res.status(500).send('error kupon')
            return res.send(dataKupon)
        })
    },
    getKuponByKupon:(req,res)=>{
        const {Kupon,userId}=req.body
        let sql=`select * from Kupon 
        where Kupon = ${db.escape(Kupon)};`
        db.query(sql,(err,kupon)=>{
            if(kupon.length){
                console.log(kupon,'ini kupon')
                // console.log(RowDataPacket.idKupon,'ini RDP')
                console.log(kupon[0].idKupon, ' ini id kupon 356')
                console.log(kupon.idKupon)
                if(err) return res.status(500).send(err)
                console.log(Kupon,' ini req body')
                sql=`update Cart set ? where UserId =${db.escape(userId)}`
                dataUpdate={
                    KuponCart:kupon[0].Description/100,
                    idKupon:kupon[0].idKupon
                 
                }
                console.log(dataUpdate.KuponCart)
                db.query(sql,dataUpdate,(err,resultKupon)=>{
                    // console.log(KuponCart)
                    if(err) return res.status(500).send(err)
                    console.log(resultKupon,'in iresult kupon')
                    console.log('berhasil update')
                    sql =`
                    select * from cart c
                    join users u
                    on u.id = c.UserId
                    join products p 
                    on p.id = c.ProductId
                    join Kupon k
                    on k.idKupon = c.idKupon
                    where c.UserId = ${userId}`
                    db.query(sql,(err,finalResult)=>{
                        if(err) return res.status(500).send('error lagi cok')
                        return res.send(finalResult)
                    })
                    // return res.send(resultKupon)
                })
            }else {
                return res.send('KUPON GAADA COK')
            }
            // console.log(kupon[0].Description/100)
            // return res.send(kupon)
        })
    },
    deleteKupon:(req,res)=>{
        const {userId}=req.body
        let sql=`select * from Cart
        where userId=2;`
        db.query(sql,(err,resultuser)=>{
            if(err) return res.status(500).send(err)
            console.log(resultuser)
            console.log(resultuser[0].id)

            sql=`update Cart 
            Set KuponCart=NULL,idKupon=NULL
            where Cart.id=${db.escape(resultuser[0].id)}; `

            db.query(sql,(err,updateKupon)=>{
                if(err) return res.status(500).send(err)
                sql=`select * from cart c
                join users u
                on u.id = c.UserId
                join products p 
                on p.id = c.ProductId
                where c.UserId = ${userId}`
                db.query(sql,(err,finalresult)=>{
                    if(err)return res.status(500).send(err)
                    console.log(finalresult)
                    return res.send(finalresult)
                })
            })
            
        })

    }
    


}