const {db}=require('./../Connection')

module.exports={

      checkQtyById:(req,res)=>{
        //   var {id,productId}=req.params
          var {id,productId}= req.query
        // console.log(req.query)
          let sql=`select * from Cart c
          join Users u
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
        select * from Cart c
        join Users u
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
        var sql=`insert into Cart set ?`
        db.query(sql,data,(err,resultAdd)=>{
            if(err) return res.status(500).send(err)
            
            db.query(`select * from Cart`,(err,resultQuery)=>{
                if(err){
                    return res.status(500).send(err)
                }
                return res.status(200).send(resultQuery)
            })

        })
    }
}