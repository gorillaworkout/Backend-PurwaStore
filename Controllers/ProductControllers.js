const fs=require('fs')
const {db}=require('./../connection')

module.exports={
    getAllHomeProduct:(req,res)=>{
        let sql=`Select * from products`
        db.query(sql,(err,dataProduct)=>{
            if(err){
                console.log(err)
                return res.status(500).send(err)
            } 
             sql=`Select * from products where merk ='Apple' limit 5`
            db.query(sql,(err,dataApple)=>{
                if(err){
                    console.log(err)
                    return res.status(500).send(err)
                }
                 sql=`Select * from products where merk='Samsung' limit 5`
                 db.query(sql,(err,dataSamsung)=>{
                    if(err){
                        console.log(err)
                        return res.status(500).send(err)
                    }
                    sql=`Select * from products order by viewer desc limit 5`
                    db.query(sql,(err,dataViewer)=>{
                        if(err){
                            console.log(err)
                            return res.status(500).send(err)
                        }
                        return res.status(200).send({
                            dataProduct:dataProduct,
                            dataApple,dataSamsung,dataViewer
                        })
                    })
                })

            })
            

        })
        
    },

    getAllApple:(req,res)=>{
        let sql=`Select * from products where merk ='Apple' limit 5`
        db.query(sql,(err,dataApple)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(dataApple)
        })
        // let sql2=`Select * from Products where merk='Samsung'`
        // db.query(sql2,(err,dataSamsung)=>{
        //     if(err)return res.status(500).send(err)
        //     return res.status(200).send(dataSamsung)
        // })
    },
    getAllSamsung:(req,res)=>{
        let sql=`Select * from products where merk='Samsung' limit 5`
        db.query(sql,(err,dataSamsung)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(dataSamsung)
        })
    },
    getMostViewed:(req,res)=>{
        let sql=`Select * from products order by viewer desc limit 5`
        db.query(sql,(err,dataViewer)=>{
            if(err)return res.status(500).send(err)
            return res.status(200).send(dataViewer)
        })
    },


    getProductById:(req,res)=>{
        var {id}=req.params
        let sql=`select * from products where id=${id}`
        db.query(sql,(err,resultProduct)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(resultProduct)
        })
    },


    // batas

    deleteProduct: (req, res)=>{
        const {id} = req.params
        let sql = `Select * from products where id = ${db.escape(id)}`
        db.query(sql, (err, dataProduct)=>{
            if(err)return res.status(500).send(err)
            if(dataProduct.length){
                sql = `delete from products where id = ${db.escape(id)}`
                db.query(sql, (err)=>{
                    if(err)return res.status(500).send(err)

                    sql = `Select * from products`
                    db.query(sql, (err, allProducts)=>{
                        if(err)return res.status(500).send(err)
                        return res.status(200).send(allProducts)
                    })
                })
            }else{
                return res.status(500).send('product tidak ada')
            }
        })
    },

    editProduct: (req, res)=>{
        let data = req.body
        const {id} = req.params
        let sql = `Select * from products where id = ${db.escape(id)}`
        db.query(sql, (err, results)=>{
            if(err)return res.status(500).send(err)

            if(results.length){
                sql = `Update products set ? where id = ${db.escape(id)}`
                console.log('sini')
                db.query(sql, data, (err)=>{
                    if(err)return res.status(500).send(err)
                    console.log('asadaa')
                    sql = `Select * from products`
                    db.query(sql, (err, allProducts)=>{
                        if(err)return res.status(500).send(err)
                        return res.status(200).send(allProducts)
                    })
                })
            }else{
                return res.status(500).send('product tidak ada')
            }
        })
    },


    addProduct:(req,res)=>{
        let data = req.body
        let sql = `insert into products set ?`
            db.query(sql,data,(err)=>{
                    if(err) return res.status(500).send(err)
                    console.log('masuk dbad')
                    sql = `select * from products`
                    db.query(sql,(err,results)=>{
                        if(err)return res.status(500).send(err)
                        return res.status(200).send(results)
                    })
            })
    }
            

}