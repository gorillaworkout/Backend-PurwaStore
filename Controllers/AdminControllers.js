const {db}=require('./../Connection')

module.exports = {
    getAdminData : (req, res)=>{
        let sql = `select t.id, tanggalPembayaran, status, buktiPembayaran, SUM(price) as totalPrice
                    from transactions t
                    join transactiondetails td
                    on t.id = td.transactionId
                    where t.metode = 'upload'
                    group by t.id;`
        // console.log('asa')
        db.query(sql, (err, dataUpload)=>{
            if(err) return res.status(500).send(err)
            
            sql=`Select * from Products`
            db.query(sql, (err, alldataProd)=>{
                if(err) return res.status(500).send(err)

                res.status(200).send({dataUpload, alldataProd})
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

                    sql = `select t.id, tanggalPembayaran, status, buktiPembayaran, SUM(price) as totalPrice
                            from transactions t
                            join transactiondetails td
                            on t.id = td.transactionId
                            where t.metode = 'upload'
                            group by t.id`
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