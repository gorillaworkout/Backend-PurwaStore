const fs=require('fs')
const {db}=require('./../Connection')

module.exports={
    getAllHomeProduct:(req,res)=>{
        let sql=`Select * from Products`
        db.query(sql,(err,dataProduct)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(dataProduct)
        })
    },

    getAllApple:(req,res)=>{
        let sql=`Select * from Products where merk ='Apple' limit 5`
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
        let sql=`Select * from Products where merk='Samsung' limit 5`
        db.query(sql,(err,dataSamsung)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(dataSamsung)
        })
    },
    getMostViewed:(req,res)=>{
        let sql=`Select * from Products order by viewer desc limit 5`
        db.query(sql,(err,dataViewer)=>{
            if(err)return res.status(500).send(err)
            return res.status(200).send(dataViewer)
        })
    },

    getProductById:(req,res)=>{
        var {id}=req.params
        let sql=`select * from Products where id=${id}`
        db.query(sql,(err,resultProduct)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(resultProduct)
        })
    }


}