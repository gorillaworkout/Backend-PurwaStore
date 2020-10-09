const mysql=require('mysql')
const db=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_DATABASE,
    port:3306
})
db.conner((err)=>{
    if(err){
        console.log('error database cok di mysqldb')
    }else {
        console.log('success connect dengan db di mysqldb')
    }
})