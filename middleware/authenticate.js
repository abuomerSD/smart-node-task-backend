var {con} = require('./../db/db');
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');
  if(!token){
	  res.status(401).send({status:0});
      return
  }	 
   }
