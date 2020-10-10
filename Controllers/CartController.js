const {db}=require('./../Connection')

module.exports={
    getAllHomeProduct:(req,res)=>{
        let sql=`Select * from Products`
        db.query(sql,(err,dataProduct)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(dataProduct)
        })
    }
}