const {db} = require('./../connection')
const {encrypt, transporter} = require('./../helpers')
const {createJWToken} = require('../helpers/jwt')
const fs = require('fs')
const handlebars = require('handlebars')
// const { resolve } = require('path')

const dbPromiseSelect = (sql) => {
    return new Promise((resolve, reject)=>{
        db.query(sql, (err, results)=>{
            if(err){
                reject (err)
            }else{
                resolve(results)
            }
        })
    })
}

module.exports={
    register: (req, res)=>{
        const {username, email, password, namaLengkap} = req.body
        let sql = `select * from users where username = ?`
        db.query(sql, [username],(err, users)=>{
            if(err) return res.status(500).send({message: 'server error'})
            if(users.length){
                return res.status(500).send({message: 'username sudah ada'})
            }else{
                var data  = {username, email, password, namaLengkap}
                sql = `insert into users set ?`
                db.query(sql, data, (err, results)=>{
                    if(err) return res.status(500).send({message: 'server error'})

                    console.log('berhasil post data users')
                    sql = `select * from users where id = ?`
                    db.query(sql, [results.insertId], (err, userslogin)=>{
                        if(err) return res.status(500).send({message: 'server error'})

                        const token = createJWToken({id:userslogin[0].id, username: userslogin[0].username})
                        const link = `http://localhost:3000/verified?token=${token}`
                        const htmlRender = fs.readFileSync('./template/email.html', 'utf8')
                        const template = handlebars.compile(htmlRender) // return function
                        const htmlEmail = template({name: userslogin[0].namaLengkap, link})
                        transporter.sendMail({
                            from : 'OpenTrip <hannah4669@gmail.com>',
                            to: email,
                            subject: 'beb confirm dong',
                            html:htmlEmail
                        }).then(()=>{
                            userslogin[0].token = token
                            return res.send(userslogin[0])
                        }).catch((err)=>{
                            return res.status(500).send({message: err.message})
                        })
                    })
                        
                    
                })
            }
        })
    },
    Login: (req,res)=>{
        const {username, password} = req.body
        let sql = `select * from users where username = ? and password = ?`
        db.query(sql, [username, password], (err, datausers)=>{
            if(err) return res.status(500).send({message: err.message})
            if(!datausers.length) return res.status(500).send({message: 'user tidak terdaftar'})
            sql = `
            select * from Cart c
            join Users u
            on u.id = c.UserId
            join products p 
            on p.id = c.ProductId
            where c.UserId = ?`

            db.query(sql,[datausers[0].id], (err,cart)=>{
                if(err) return res.status(500).send({message: err.message})
                const token = createJWToken({id:datausers[0].id, username:datausers[0].username})
                datausers[0].token = token
                // datausers[0].cart = cart
                return res.send({datauser: datausers[0], cart})
            })

        })
    },

    keepLogin: (req, res) => { 
        const {id} = req.params
        let sql = `select * from users where id = ${db.escape(id)}`
        db.query(sql, (err, results)=>{
            if(err) return res.status(500).send({message: err.message})

            return res.send(results)
        })
    }
}
