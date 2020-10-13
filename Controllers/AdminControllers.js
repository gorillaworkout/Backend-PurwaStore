const {db}=require('./../Connection')

module.exports = {
    getWaitingAdmin : (req, res)=>{
        let sql = `select t.id, t.tanggalPembayaran,status,buktiPembayaran, t.metode, u.namaLengkap, SUM(price) as totalPrice
                    from transactions t
                    join transactiondetails td
                    on t.id = td.transactionId
                    join users u
                    on t.userId = u.id
                    where t.status = 'WaitingAdmin'
                    group by t.id;`
        // console.log('asa')
        db.query(sql, (err, dataUpload)=>{
            if(err) return res.status(500).send(err)
            
            sql=`Select * from Products`
            db.query(sql, (err, alldataProd)=>{
                if(err) return res.status(500).send(err)

                sql = `select t.id, t.tanggalPembayaran,status,buktiPembayaran, t.metode, u.namaLengkap, SUM(price) as totalPrice
                        from transactions t
                        join transactiondetails td
                        on t.id = td.transactionId
                        join users u
                        on t.userId = u.id
                        where t.status = 'completed' or t.status = 'failed'
                        group by t.id;`
                db.query(sql, (err, dataCompleted)=>{
                    if(err)return res.status(500).send(err)
                    
                    sql = `select t.id, u.namaLengkap, p.namaHp, p.gambar , td.qty, td.price, (td.qty * td.price) as subtotal
                            from transactions t
                            join transactiondetails td
                            on t.id = td.transactionId
                            join users u
                            on t.userId = u.id
                            join products p
                            on td.productId = p.id
                            order by t.id;`

                    db.query(sql, (err, detailTrans)=>{
                        if(err)return res.status(500).send(err)

                        return res.status(200).send({
                            alldataProd, dataUpload, dataCompleted, detailTrans
                        })
                    })
                })
                
            })
        })
    },

    accBuktiPembayaran: (req, res) =>{
        let data = req.body
        const {id} = req.params
        let sql = `select * from transactions where id = ${db.escape(id)}`
        db.query(sql, (err, results)=>{
            if(err)return res.status(500).send(err)

            if(results.length){
                sql = `Update transactions set ? where id = ${db.escape(id)}`
                db.query(sql, data, (err)=>{
                    if(err)return res.status(500).send(err)

                    sql = `select t.id, t.tanggalPembayaran,status,buktiPembayaran, t.metode, u.namaLengkap, SUM(price) as totalPrice
                            from transactions t
                            join transactiondetails td
                            on t.id = td.transactionId
                            join users u
                            on t.userId = u.id
                            where t.status = 'completed' or t.status = 'failed'
                            group by t.id;`
                    db.query(sql, (err, allProducts)=>{
                        if(err)return res.status(500).send(err)
                        return res.status(200).send(allProducts)
                    })
                })
            }else{
                return res.status(500).send('transaksi tidak ada')
            }
        })
    }
}