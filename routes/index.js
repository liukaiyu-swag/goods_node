var express = require('express');
var router = express.Router();
var path = require("path");
var mysql = require("./mysql.js");
/* GET home page. */
router.get('/add/:id',function(req,res){
	mysql.query(`insert into cars (gid,num) values ('${req.params.id}','1')`,function(err,result){
		console.log(err);
		if(result.affectedRows>0){
			res.end("ok");
		}
	});
});
router.get('/', function(req, res, next) {
	res.sendFile(path.join(process.cwd(), "views", "index.html"));
});
router.get('/selectGoods',function(req,res){
	mysql.query("select * from goods",function(err,result){
		if(!err){
			res.send(JSON.stringify(result||[]));
		}
	});
});
router.get("/find", function(req, res) {
	mysql.query("select cars.*,goods.* from cars,goods where cars.gid=goods.id", function(err, result) {
		if(!err) {
			res.send(JSON.stringify(result || []));
		};
	});
});
router.get("/update/:id/:num", function(req, res) {
	mysql.query("update cars set num='"+req.params.num+ "' where cid='"+req.params.id+"'", function(err, result) {				
		if(result.affectedRows>0){
			res.end("ok");
		}
	});
});
router.post("/del",function(req,res){
	mysql.query("delete from cars where cid="+req.body.id,function(err,result){
		if(result.affectedRows>0){
			res.end("ok");
		}
	});
})
module.exports = router;