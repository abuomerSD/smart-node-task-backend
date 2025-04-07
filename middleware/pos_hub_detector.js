const { conn } = require("../db/conn")

const detector =async(req, res, next)=>{

    try {
       
      console.log("methods :",req.method)
      if(req.method =="GET" && req.query.pos_hub_id ){
        console.log("this is a GET method")
        req.pos_hub = await conn.pos_hubs.findOne({
            where:{
                id : req.query.pos_hub_id
            }
        })
        
      }else if(req.method =="POST" && req.body.pos_hub_id){
        console.log("this is a POST method")
        req.pos_hub = await conn.pos_hubs.findOne({
            where:{
                id : req.body.pos_hub_id
            }
        })
      }
      next()
    }
    catch(e){

    }

}

module.exports = detector;
